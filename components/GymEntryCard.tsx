import React, { FC } from 'react';
import { View, Text } from 'react-native';
import { Card, Avatar, Icon, useTheme } from '@rneui/themed';
import dayjs from 'dayjs';
import { GymEntry } from '@/app/types';
import { useAuth } from './AuthProvider';

interface GymEntryCardProps {
  gymEntry: GymEntry;
}

const GymEntryCard: FC<GymEntryCardProps> = ({ gymEntry }) => {
  const { theme } = useTheme();

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
    <Card containerStyle={{ borderRadius: 8, padding: 16 }}>
      <View
        style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}
      >
        <Avatar
          rounded
          source={{ uri: userData?.profilePic || undefined }}
          size='medium'
        />
        <Text style={{ marginLeft: 12, fontSize: 18, fontWeight: 'bold' }}>
          {userData?.username}
        </Text>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: 16, color: theme.colors.primary }}>
          {dayjs(new Date(gymEntry.date)).format(' PPpp')}
        </Text>
        <Icon
          name={workoutTypeIcons[gymEntry.type]}
          type='material-community'
          color={theme.colors.secondary}
          size={28}
        />
      </View>

      <Text style={{ marginVertical: 10, fontSize: 16 }}>
        {`Points Earned: ${gymEntry.points}`}
      </Text>

      {gymEntry.notes && (
        <Text
          style={{
            fontSize: 14,
            fontStyle: 'italic',
            color: theme.colors.grey3,
          }}
        >
          {`Notes: ${gymEntry.notes}`}
        </Text>
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

export default GymEntryCard;
