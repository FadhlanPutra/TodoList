import { View, Text, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import tw from 'twrnc';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign, Entypo } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Checkbox from 'expo-checkbox';


const Explore = () => {
  const [text, setText] = useState(false);
  const [show, setShow] = useState(false);
  const [mapel, setMapel] = useState('');
  const [tugas, setTugas] = useState('');
  const [deadline, setDeadline] = useState(new Date());
  const [list, setList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const handleChange = (event, selectedDate) => {
    if (event.type === 'set' && selectedDate) {
      setDeadline(selectedDate);
    }
    setShow(false);
  };

  const addTask = () => {
    if (mapel.trim() === '' && tugas.trim() === '' || !deadline) {
      Alert.alert('Alamak', 'Semua field harus diisi!');
      return;
    }
    
    if (mapel.length < 3){
      Alert.alert('Alamak', 'Minimal 3 huruf mapelnya');
      return;
    }

    if (tugas.length < 3){
      Alert.alert('Alamak', 'Minimal 3 huruf tugasnya');
      return;
    }
    
    const newTask = {
      id: Date.now().toString(),
      mapel: mapel.trim(),
      tugas: tugas.trim(),
      deadline: deadline.getTime(),
    };

    setList([...list, newTask]);
    resetForm();
  };

  const saveTask = async () => {
    try {
      await AsyncStorage.setItem('tugas', JSON.stringify(list));
    } catch (error) {
      console.error('Gagal menyimpan tugas:', error);
    }
  };

  const loadTask = async () => {
    try {
      const saved = await AsyncStorage.getItem('tugas');
      if (saved) {
        setList(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Gagal memuat tugas:', error);
    }
  };

  const deleteTask = (id: string) => {
    Alert.alert('Hapus Tugas', 'Apakah Anda yakin ingin menghapus tugas ini?', [
      {
        text: 'Batal',
        style: 'cancel',
      },
      {
        text: 'Hapus',
        onPress: () => {
          const filtered = list.filter((item) => item.id !== id);
          Alert.alert('Berhasil', 'Berhasil menghapus tugas');
          setList(filtered);
        },
      },
    ]);
    // const filtered = list.filter((item) => item.id !== id);
    // setList(filtered);
  };

  const handleEdit = () => {
    const updated = list.map((item) =>
      item.id === editId
        ? {
            ...item,
            mapel: mapel.trim(),
            tugas: tugas.trim(),
            deadline: deadline.getTime(),
          }
        : item
    );

    setList(updated);
    resetForm();
  };

  const startEdit = (item) => {
    setMapel(item.mapel);
    setTugas(item.tugas);
    setDeadline(new Date(item.deadline));
    setIsEditing(true);
    setEditId(item.id);
  };

  const resetForm = () => {
    setMapel('');
    setTugas('');
    setDeadline(new Date());
    setIsEditing(false);
    setEditId(null);
  };

  const toggleChecked = (id: string) => {
    const updatedList = list.map((item) =>
      item.id === id ? { ...item, isChecked: !item.isChecked } : item
    );
    setList(updatedList);
  };

  useEffect(() => {
    loadTask();
  }, []);

  useEffect(() => {
    saveTask();
  }, [list]);

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={tw`p-4`}>
        <View style={tw`gap-4`}>
          <Text style={tw`font-bold text-2xl items-center`}>
            <AntDesign name="book" size={24} />
            {' Tugas Guwe'}
          </Text>
          <TextInput
            value={mapel}
            onChangeText={setMapel}
            style={tw`border-2 border-gray-500 rounded-lg p-2 w-full text-black`}
            placeholder="Tambahkan Mata Pelajaran"
          />
          <TextInput
            value={tugas}
            onChangeText={setTugas}
            style={tw`border-2 border-gray-500 rounded-lg p-2 w-full text-black`}
            placeholder="Judul Tugas"
          />
          <View style={tw`relative w-full flex-row items-center justify-between `}>
            <TouchableOpacity style={tw`border-2 border-gray-500 rounded-lg p-2 w-80%`}>
              <Text style={tw`text-black`}>Deadline: {new Date(deadline).toLocaleDateString()}</Text>
            </TouchableOpacity>
              <AntDesign
              onPress={() => setShow(true)}
              name="calendar"
              size={24}
              color="white"
              style={tw`absolute right-2 bg-[#032a4e] rounded-lg p-2`}
              />
              {show && (
                <DateTimePicker
                  value={deadline}
                  mode="date"
                  display="default"
                  onChange={handleChange}
                />
              )}
          </View>
          <TouchableOpacity
            style={tw`bg-[#032a4e] p-3 rounded-lg mb-5`}
            onPress={isEditing ? handleEdit : addTask}
          >
            <Text style={tw`text-white font-semibold text-center`}>
              {isEditing ? 'Simpan Edit' : 'Tambah Tugas'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={[tw`my-2 text-gray-500 font-bold text-lg`, list.length > 0 ? null : tw`text-center`]}>{list.length > 0 ? 'Ada tugas ni kamu' : 'Yeay gak ada tugas'}</Text>

        <FlatList
          data={list}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={tw`flex-row items-center justify-between bg-white p-2 rounded-lg mb-2 shadow-lg`}>
              <View style={tw`flex-1`}>
            <TouchableOpacity style={tw`flex-row items-center w-full`} onPress={() => toggleChecked(item.id)}>
              <Checkbox
                value={item.isChecked}
                onValueChange={() => toggleChecked(item.id)}
                color={item.isChecked ? "#4630EB" : undefined}
                />
              <Text
                style={[
                  tw`ml-4`,
                  item.isChecked ? tw`line-through text-gray-500` : tw`text-black`,
                ]}
                >
                <Text style={tw`ml-4 text-black`}>
                  <Text style={[item.isChecked ? tw`line-through text-gray-400 font-bold text-xl` : tw`font-bold text-xl`]}>{item.mapel}</Text>
                  {'\n'}
                  <Text style={[item.isChecked ? tw`line-through text-gray-400 text-lg` : tw`text-gray-500 text-lg`]}>{item.tugas}</Text>
                  {'\n'}
                  <Text style={[item.isChecked ? tw`line-through text-gray-400 font-bold text-lg` : tw`font-bold text-lg text-red-500`]}>
                    {new Date(item.deadline).toLocaleDateString()}
                  </Text>
                </Text>
              </Text>
            </TouchableOpacity>
              </View>
          
              <View style={tw`flex-row gap-3 items-center ml-auto`}>
                <TouchableOpacity onPress={() => startEdit(item)} style={tw`mr-2`}>
                  <Entypo
                    name="edit"
                    size={24}
                    color="white"
                    style={tw`bg-[#032a4e] p-2 rounded-lg`}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteTask(item.id)}>
                  <Entypo
                    name="trash"
                    size={24}
                    color="white"
                    style={tw`bg-red-500 p-2 rounded-lg`}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />

      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default Explore;
