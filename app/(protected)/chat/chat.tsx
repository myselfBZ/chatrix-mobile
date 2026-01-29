import { ConversationItem } from "@/components/ConversationItem";
import { ChatHeader } from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import SearchResultItem from "@/components/SearchResultItem";
import { useChatConnection } from "@/hooks/useChatConnection";
import { useConversations } from "@/hooks/useConversations";
import { useSearchedUser } from "@/hooks/useSearchedUser";
import { SearchUserResult } from "@/services/api";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, View } from "react-native";

export default function Chat() {
  const { conversations } = useConversations();
  const connected = useChatConnection();  
  const router = useRouter();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchUserResult[]>([]);
  const { setSearchedUser } = useSearchedUser()
  const handleSearch = (results: SearchUserResult[]) => {
    setSearchResults(results);
  };

  return (
    <View className="flex-1 bg-slate-950">
      <ChatHeader connected={connected} />

      <SearchBar 
        onFocusChange={setIsSearchFocused} 
        onSearch={handleSearch}
      />

    <ScrollView
      keyboardShouldPersistTaps="always"
      className="flex-1 px-4 pt-4"
    >
      {searchResults.length > 0 ? (
        searchResults.map((user) => (
          <SearchResultItem 
            key={user.id}
            user={user} 
            onPress={(id) => {
              setSearchedUser(user);
              const exists = conversations.find((v) => user.id === v.user_data.id);

              router.push({
                pathname: `/chat/[id]`,
                params: { 
                  id: user.id,
                  isNew: !exists ? "true" : "false"
                }
              });
            }} 
          />
        ))
      ) : !isSearchFocused ? (
        conversations.map((item) => (
          <ConversationItem
            onPress={(id) => router.push({
              pathname: `/chat/[id]`,
              params: { id: id }
            })}
            key={item.user_data.conversation_id} 
            item={item} 
          />
        ))
      ) : null}
    </ScrollView>
    </View>
  );
}