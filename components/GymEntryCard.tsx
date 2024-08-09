import React, { FC } from 'react';
import { StyleSheet, useColorScheme, View } from 'react-native';
import { Card, Avatar, Icon, useTheme } from '@rneui/themed';
import dayjs from 'dayjs';
import { GymEntry } from '@/app/types';
import { useAuth } from './AuthProvider';
import 'dayjs/locale/it';
import ThemedText from './ThemedText';

interface GymEntryCardProps {
  gymEntry: GymEntry;
  showUser?: boolean;
}

const GymEntryCard: FC<GymEntryCardProps> = ({ gymEntry, showUser }) => {
  const { theme } = useTheme();
  const colorScheme = useColorScheme();

  const workoutTypeIcons = {
    GYM: 'dumbbell',
    CARDIO: 'run',
    YOGA: 'meditation',
    SPORT: 'soccer',
    OTHER: 'dots-horizontal',
  };

  const mediaTypeIcons = {
    IMAGE: 'image',
    VIDEO: 'video',
    AUDIO: 'music',
  };

  const { userData } = useAuth();

  return (
    <Card
      containerStyle={{
        borderRadius: 8,
        padding: 16,
        width: '100%',
        ...styles[colorScheme === 'dark' ? 'darkCard' : 'lightCard'],
      }}
    >
      {!!showUser && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <Avatar
            rounded
            source={{ uri: userData?.profilePic || undefined }}
            size='medium'
          />
          <ThemedText style={{ marginLeft: 12, fontSize: 18 }} bold>
            {userData?.username}
          </ThemedText>
        </View>
      )}

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <ThemedText style={{ fontSize: 16 }}>
          {dayjs(new Date(gymEntry.date)).locale('it').format('ddd M YYYY')}
        </ThemedText>
        <Icon
          name={workoutTypeIcons[gymEntry.type]}
          type='material-community'
          color={theme.colors.secondary}
          size={28}
          accessibilityLabel={gymEntry.type}
          style={{ marginLeft: 12 }}
        />
      </View>

      <ThemedText style={{ marginVertical: 10, fontSize: 16 }}>
        Punti: <ThemedText bold>{gymEntry.points}</ThemedText>
      </ThemedText>

      {gymEntry.notes && (
        <ThemedText
          style={{
            fontSize: 14,
            fontStyle: 'italic',
            color: theme.colors.grey3,
          }}
        >
          {`Note: ${gymEntry.notes}`}
        </ThemedText>
      )}

      {gymEntry.media.length > 0 && (
        <View style={{ flexDirection: 'row', marginTop: 10 }}>
          {gymEntry.media.map((mediaItem, index) => (
            <Icon
              key={index}
              name={mediaTypeIcons[mediaItem.type]}
              type='material-community'
              color={theme.colors.grey2}
              size={28}
              containerStyle={{ marginRight: 12 }}
              onPress={() => {
                // Handle media preview or action here
              }}
            />
          ))}
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  lightCard: {
    backgroundColor: '#fff',
  },
  darkCard: {
    backgroundColor: '#333',
  },
});

export default GymEntryCard;
