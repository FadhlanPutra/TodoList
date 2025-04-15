import React, { useState, useEffect } from "react";
import {
  Image,
  StyleSheet,
  Platform,
  Text,
  View,
  Button,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";

import Checkbox from 'expo-checkbox';

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import tw from "twrnc";
import Survey from "@/components/Survey";
import { Fontisto } from "@expo/vector-icons";


export default function HomeScreen() {
  // const [isChecked, setChecked] = useState(false);

  const [task, setTask] = useState("");
  const [list, setList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(false);

  const addTask = () => {
    if (task.trim() === "") return;

    const newTask = {
      id: Date.now().toString(),
      title: task.trim(),
    };
    setList([...list, newTask]);
    setTask("");
  };

  const saveTask = async () => {
    try {
      await AsyncStorage.setItem("task", JSON.stringify(list));
      console.log("Berhasil Simpan Data");
    } catch (error) {
      console.error("Gagal Simpan:", error);
    }
  };

  const loadTask = async () => {
    try {
      const saved = await AsyncStorage.getItem("task");
      if (saved !== null) {
        setList(JSON.parse(saved));
        console.log("Berhasil Ambil Data");
      }
    } catch (error) {
      console.error("Gagal Ambil:", error);
    }
  };

  const deleteTask = (id: string) => {
    const filtered = list.filter(item => item.id !== id);
    setList(filtered);
    console.log("Berhasil Hapus Data");
  }

  const toggleChecked = (id) => {
    const updatedList = list.map((item) =>
      item.id === id ? { ...item, isChecked: !item.isChecked } : item
    );
    setList(updatedList);
  };
  
  const handleEdit = () => {
    const updated = list.map(item => item.id === editId ? {...item, title: task.trim()}: item);

    setList(updated);
    setTask('');
    setIsEditing(false);
    setEditId(null);
  }

  const startEdit = (item: any) => {
    setTask(item.title);
    setIsEditing(true);
    setEditId(item.id);
  }

  useEffect(() => {
    loadTask();
  }, []);

  useEffect(() => {
    saveTask();
  }, [list]);


  return (
    <SafeAreaView style={tw`flex-1 bg-gray-100`}>
      <View style={tw`bg-yellow-300 w-100% h-20% absolute rounded-b-full items-center justify-center`}></View>
      <View style={tw`mx-5`}>

      <Text style={tw`text-xl font-bold mb-4`}>To do List</Text>
      <View style={tw`flex-row max-w-full items-center`}>
        <TextInput
          value={task}
          onChangeText={setTask}
          style={tw`border-2 border-gray-500 rounded-lg p-2 w-4/5 text-black`}
          placeholder="Tambahkan Tugas"
          />
        <TouchableOpacity
          style={tw`bg-blue-500 p-3 rounded-lg ml-2`}
          onPress={isEditing ? handleEdit : addTask}>
          <Text style={tw`text-white font-semibold`}>{isEditing ? 'Simpan Edit': 'Tambah'}</Text>
        </TouchableOpacity>
      </View>


      <View style={tw`my-5`}>
        <View style={tw`flex-row items-center gap-5`}>
          <Image source={require('@/assets/images/icon.png')} style={tw`w-20% h-20 rounded-full`} resizeMode="cover" />
          <View style={tw`flex-col justify-center`}>
            <ThemedText>Tasks</ThemedText>
            <ThemedText style={tw`text-2xl font-bold`}>Personal</ThemedText>
          </View>
        </View>
      </View>

      <FlatList
        data={list}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
          style={tw`flex-row items-center justify-between bg-white p-2 rounded-lg mb-2`}
          >
            <TouchableOpacity style={tw`flex-row items-center w-80%`} onPress={() => toggleChecked(item.id)}>
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
                  {item.title}
              </Text>
            </TouchableOpacity>

              <TouchableOpacity onPress={() => startEdit(item)} style={tw`mr-3`}>
                <Text style={tw`text-blue-500 font-bold`}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteTask(item.id)}>
                <Text style={tw`text-red-500 font-bold`}>Hapus</Text>
              </TouchableOpacity>
          </View>
        )}
        />
      
        </View>

    </SafeAreaView>
  );
}
