import { useTyping } from '@/hooks/useTyping';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Keyboard,
  Platform,
  Pressable,
  TextInput,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function ChatInput({ 
  onSend,
  onTyping
}: { 
  onSend: (msg: string) => void;
  onTyping: (isTyping: boolean) => void;
}) {
  const [message, setMessage] = useState('');
  const insets = useSafeAreaInsets();
  
  const slideAnim = useRef(new Animated.Value(100)).current;
  const sendButtonScale = useRef(new Animated.Value(1)).current;

  useTyping(message, onTyping)

  useEffect(() => {
    // Slide up animation on mount
    Animated.spring(slideAnim, {
      toValue: 0,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();

    // Keyboard listeners for smooth transitions
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 80,
          friction: 8,
          useNativeDriver: true,
        }).start();
      }
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 80,
          friction: 8,
          useNativeDriver: true,
        }).start();
      }
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  // Animate send button when text changes
  useEffect(() => {
    Animated.spring(sendButtonScale, {
      toValue: message.trim() ? 1 : 0.9,
      tension: 100,
      friction: 6,
      useNativeDriver: true,
    }).start();
  }, [message]);

  const handleSend = () => {
    if (message.trim().length === 0) return;
    
    // Bounce animation on send
    Animated.sequence([
      Animated.timing(sendButtonScale, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(sendButtonScale, {
        toValue: 1,
        tension: 100,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();

    onSend(message);
    setMessage('');
  };

  return (
 <Animated.View
  style={{ 
    transform: [{ translateY: slideAnim }],
    paddingBottom: Platform.select({
      ios: Math.max(insets.bottom, 8),
      android: Math.max(insets.bottom, 4)
    })
  }}
  className="flex-row items-end px-4 pt-3"
>
  <View className="flex-1 bg-slate-900 rounded-2xl px-4 py-2 flex-row items-center border border-slate-800">
    <TextInput
      value={message}
      onChangeText={setMessage}
      placeholder="Message..."
      placeholderTextColor="#64748b"
      multiline
      className="flex-1 text-white text-[16px] max-h-32 py-1"
      style={{ 
        textAlignVertical: 'center',
        maxHeight: Platform.select({
          ios: 120,
          android: 100
        })
      }}
      enablesReturnKeyAutomatically
      returnKeyType="send"
      onSubmitEditing={handleSend}
      blurOnSubmit={false}
    />
    
    <Animated.View style={{ transform: [{ scale: sendButtonScale }] }}>
      <Pressable 
        onPress={handleSend}
        disabled={!message.trim()}
        className={`ml-2 p-2 rounded-full ${
          message.trim() ? 'bg-blue-600' : 'bg-slate-800'
        }`}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons 
          name="arrow-up" 
          size={20} 
          color={message.trim() ? 'white' : '#64748b'} 
        />
      </Pressable>
    </Animated.View>
  </View>
</Animated.View>  );
}
