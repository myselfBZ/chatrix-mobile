import { useAuth } from '@/context/Auth';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View
} from 'react-native';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    setError('');
    
    if (!username.trim() || !password.trim()) {
      setError('Both fields are required');
      return;
    }
    
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser = { id: 'u1', username: username.trim() };
      const mockToken = 'jwt_secret_token';
      
      login(mockUser, mockToken);
      router.replace('/');
    } catch (e) {
      console.error(e);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-[#020617] px-8 justify-center"
    >
      <View className="items-center mb-12">
        <View className="w-20 h-20 bg-blue-600 rounded-3xl items-center justify-center rotate-12 shadow-2xl shadow-blue-500/50">
          <Ionicons name="chatbubbles" size={40} color="white" />
        </View>
        <Text className="text-white text-4xl font-bold tracking-tighter mt-8">
          Chatrix
        </Text>
        <Text className="text-slate-400 text-lg mt-2">
          Welcome back, engineer.
        </Text>
      </View>

      <View className="space-y-4">
        <View className="bg-slate-900/50 border border-slate-800 rounded-2xl px-4 py-3">
          <Text className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mb-1">
            Username
          </Text>
          <TextInput
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              setError('');
            }}
            placeholder="GoMaster18"
            placeholderTextColor="#64748b"
            style={{ color: '#ffffff' }}
            className="text-lg py-1"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
            returnKeyType="next"
          />
        </View>

        <View className="bg-slate-900/50 border border-slate-800 rounded-2xl px-4 py-3">
          <Text className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mb-1">
            Password
          </Text>
          <View className="flex-row items-center">
            <TextInput
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setError('');
              }}
              placeholder="••••••••"
              placeholderTextColor="#64748b"
              style={{ color: '#ffffff' }}
              className="text-lg py-1 flex-1"
              secureTextEntry={!showPassword}
              editable={!loading}
              returnKeyType="go"
              onSubmitEditing={handleLogin}
            />
            <Pressable 
              onPress={() => setShowPassword(!showPassword)}
              className="ml-2 p-1"
            >
              <Ionicons 
                name={showPassword ? "eye-off" : "eye"} 
                size={20} 
                color="#94a3b8" 
              />
            </Pressable>
          </View>
        </View>

        {error ? (
          <View className="bg-red-500/10 border border-red-500/50 rounded-xl px-4 py-3">
            <Text className="text-red-400 text-sm text-center">{error}</Text>
          </View>
        ) : null}

        <Pressable 
          onPress={handleLogin}
          disabled={loading || !username.trim() || !password.trim()}
          className={`h-16 rounded-2xl items-center justify-center shadow-lg mt-2 ${
            loading || !username.trim() || !password.trim()
              ? 'bg-slate-800' 
              : 'bg-blue-600 active:bg-blue-700'
          }`}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-lg font-bold">Initialize Session</Text>
          )}
        </Pressable>
      </View>

      <Pressable className="mt-8 self-center" disabled={loading}>
        <Text className="text-slate-400">
          Don't have an account? <Text className="text-blue-500 font-bold">Sign up</Text>
        </Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
}