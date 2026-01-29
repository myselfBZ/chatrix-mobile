import { useAuth } from '@/context/Auth'; // adjust to however you get the token
import { searchUser, SearchUserResult } from '@/services/api'; // adjust the import path
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, TextInput, View } from 'react-native';
import { MagnifyingGlassIcon, XMarkIcon } from 'react-native-heroicons/outline';

interface SearchBarProps {
  onFocusChange?: (focused: boolean) => void;
  onSearch?: (results: SearchUserResult[]) => void;
}

export default function SearchBar({ onFocusChange, onSearch }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth(); // or however you access the token

  // Debounced search effect
  useEffect(() => {
    if (!searchQuery.trim() || !token) {
      onSearch?.([]);
      return;
    }

    setIsLoading(true);
    const timeoutId = setTimeout(async () => {
      try {
        const response = await searchUser({ 
          token, 
          query: searchQuery.trim() 
        });
        onSearch?.(response.data);
      } catch (error) {
        console.error('Search error:', error);
        onSearch?.([]);
      } finally {
        setIsLoading(false);
      }
    }, 300); // 300ms debounce

    return () => {
      clearTimeout(timeoutId);
      setIsLoading(false);
    };
  }, [searchQuery, token, onSearch]);

  const handleClear = () => {
    setSearchQuery('');
    onSearch?.([]);
  };

  const handleFocus = () => {
    setIsFocused(true);
    onFocusChange?.(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    onFocusChange?.(false);
  };

  return (
    <View className="px-4 pt-4 pb-2">
      <View 
        className={`flex-row items-center rounded-xl px-4 py-3 ${
          isFocused 
            ? 'bg-slate-800 border-2 border-blue-500' 
            : 'bg-slate-900 border-2 border-slate-800'
        }`}
      >
        <MagnifyingGlassIcon 
          size={20} 
          color={isFocused ? '#3b82f6' : '#64748b'} 
        />
        
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="Search users..."
          placeholderTextColor="#64748b"
          className="flex-1 ml-3 text-white text-base"
          selectionColor="#3b82f6"
        />
        
        {isLoading && (
          <ActivityIndicator size="small" color="#3b82f6" className="mr-2" />
        )}
        
        {searchQuery.length > 0 && !isLoading && (
          <Pressable 
            onPress={handleClear}
            className="ml-2 p-1 rounded-full bg-slate-700 active:bg-slate-600"
          >
            <XMarkIcon size={16} color="#94a3b8" />
          </Pressable>
        )}
      </View>
    </View>
  );
}