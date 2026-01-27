import { useAuth } from '@/context/Auth';
import { createAccessToken } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View
} from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    setError('');
    
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    try {
      const resp = await createAccessToken({ email: email, password: password })

      login({
        username: resp.data.user.username,
        id: resp.data.user.id
      }, resp.data.access_token);
      router.replace('/chat/chat');
    } catch (e) {
      console.error(e);
      setError('Invalid username or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-gradient-to-b from-slate-950 to-slate-900"
      style={{ backgroundColor: '#0f172a' }}
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        className="flex-1"
      >
        <View className="flex-1 px-6 pt-20">
          {/* Header Section */}
          <View className="items-center mb-16">
            <View className="w-16 h-16 bg-blue-600 rounded-2xl items-center justify-center shadow-lg shadow-blue-500/30 mb-6">
              <Ionicons name="chatbubbles" size={32} color="white" />
            </View>
            <Text className="text-white text-3xl font-bold mb-2">
              Welcome Back
            </Text>
            <Text className="text-slate-400 text-base">
              Sign in to continue to Chatrix
            </Text>
          </View>

          {/* Form Section */}
          <View className="space-y-5">
            {/* Email/Username Input */}
            <View>
              <Text className="text-slate-300 text-sm font-medium mb-2 ml-1">
                Username
              </Text>
              <View className="bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-4">
                <TextInput
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setError('');
                  }}
                  placeholder="Enter your username"
                  placeholderTextColor="#64748b"
                  style={{ color: '#ffffff', fontSize: 16 }}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                  returnKeyType="next"
                />
              </View>
            </View>

            {/* Password Input */}
            <View>
              <Text className="text-slate-300 text-sm font-medium mb-2 ml-1">
                Password
              </Text>
              <View className="bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-4 flex-row items-center">
                <TextInput
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setError('');
                  }}
                  placeholder="Enter your password"
                  placeholderTextColor="#64748b"
                  style={{ color: '#ffffff', fontSize: 16, flex: 1 }}
                  secureTextEntry={!showPassword}
                  editable={!loading}
                  returnKeyType="go"
                  onSubmitEditing={handleLogin}
                />
                <Pressable 
                  onPress={() => setShowPassword(!showPassword)}
                  className="ml-3"
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons 
                    name={showPassword ? "eye-off-outline" : "eye-outline"} 
                    size={22} 
                    color="#94a3b8" 
                  />
                </Pressable>
              </View>
            </View>

            {/* Error Message */}
            {error ? (
              <View className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
                <Text className="text-red-400 text-sm text-center">{error}</Text>
              </View>
            ) : null}

            {/* Login Button */}
            <Pressable 
              onPress={handleLogin}
              disabled={loading || !email.trim() || !password.trim()}
              className={`h-14 rounded-xl items-center justify-center mt-2 ${
                loading || !email.trim() || !password.trim()
                  ? 'bg-slate-700 opacity-50' 
                  : 'bg-blue-600 active:bg-blue-700'
              }`}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-base font-semibold">Sign In</Text>
              )}
            </Pressable>

            {/* Forgot Password */}
            <Pressable className="self-center mt-2" disabled={loading}>
              <Text className="text-blue-500 text-sm">
                Forgot password?
              </Text>
            </Pressable>
          </View>

          {/* Bottom Section */}
          <View className="flex-1 justify-end pb-8 mt-12">
            <Pressable className="self-center" disabled={loading}>
              <Text className="text-slate-400 text-sm">
                Don't have an account?{' '}
                <Text className="text-blue-500 font-semibold">Sign Up</Text>
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}