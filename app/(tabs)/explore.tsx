import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import tw from 'twrnc';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Explore = () => {
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
    if (!mapel.trim() || !tugas.trim() || !deadline) {
      alert('Semua field harus diisi!');
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

  const deleteTask = (id) => {
    const filtered = list.filter((item) => item.id !== id);
    setList(filtered);
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
          <TouchableOpacity onPress={() => setShow(true)} style={tw`border-2 border-gray-500 rounded-lg p-2 w-full`}>
            <Text style={tw`text-black`}>Deadline: {new Date(deadline).toLocaleDateString()}</Text>
          </TouchableOpacity>
          {show && (
            <DateTimePicker
              value={deadline}
              mode="date"
              display="default"
              onChange={handleChange}
            />
          )}
          <TouchableOpacity
            style={tw`bg-blue-500 p-3 rounded-lg mb-5`}
            onPress={isEditing ? handleEdit : addTask}
          >
            <Text style={tw`text-white font-semibold text-center`}>
              {isEditing ? 'Simpan Edit' : 'Tambah Tugas'}
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={list}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={tw`flex-row items-center justify-between bg-white p-2 rounded-lg mb-2`}>
              <View style={tw`flex-col gap-3`}>
                <Text style={tw`ml-4 text-black`}>
                  <Text style={tw`font-bold text-xl`}>{item.mapel}</Text>
                  {'\n'}
                  <Text style={tw`text-md text-gray text-md`}>📚{item.tugas}</Text>
                  {'\n'}
                  <Text style={tw`text-md text-gray text-ld`}>
                    📅Deadline: {new Date(item.deadline).toLocaleDateString()}
                  </Text>
                </Text>
                <View style={tw`flex-row ml-3`}>
                  <TouchableOpacity onPress={() => startEdit(item)} style={tw`mr-3`}>
                    <Text style={tw`bg-yellow-400 p-2 rounded-lg px-2 text-black font-bold text-lg`}> Edit </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteTask(item.id)}>
                    <Text style={tw`bg-red-500 p-2 rounded-lg px-2 text-white font-bold text-lg`}>Hapus</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default Explore;
