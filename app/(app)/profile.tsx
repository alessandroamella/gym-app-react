import { useAuth } from '@/components/AuthProvider';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
  Modal,
  Pressable,
  useColorScheme,
} from 'react-native';
import { Avatar, Button, Card, Icon, Input, useTheme } from '@rneui/themed';
import { LineChart, lineDataItem } from 'react-native-gifted-charts';
import dayjs from 'dayjs';
import 'dayjs/locale/it'; // ES 2015
import relativeTime from 'dayjs/plugin/relativeTime';
import ThemedText from '@/components/ThemedText';
import Container from '@/components/Container';
import StackScreen from '@/components/StackScreen';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { config } from '@/constants/config';
import TextInput from '@/components/TextInput';
import { AxiosError, isAxiosError } from 'axios';
import { UserData } from '../types';
import GymEntryCard from '@/components/GymEntryCard';
import DatePicker from 'react-native-date-picker';
import { errors, getError } from '@/constants/errors';

dayjs.extend(relativeTime);

export default function Profile() {
  const { signOut, userData, setUserData, refreshUserData, token } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState(userData?.username || '');
  const [profilePic, setProfilePic] = useState<string | undefined>(undefined);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshUserData();
    setRefreshing(false);
  }, [refreshUserData]);

  const [disabled, setDisabled] = useState(false);

  const handleUpdateProfile = async (key: keyof UserData, val: string) => {
    if (!token) {
      Alert.alert('You need to be logged in to update your profile');
      return;
    }
    setDisabled(true);
    try {
      setEditingUsername(false);
      const { data } = await config.axiosBase(token!).patch('/me', {
        [key]: val,
      });
      console.log('Updated profile:', data);
      setUserData({
        ...userData!,
        ...data,
      });
    } catch (error) {
      Alert.alert(
        'Error updating profile',
        (
          (JSON.stringify((error as AxiosError)?.response?.data) ||
            error) as string
        ).toString(),
      );
      console.error('Error updating profile:', error);
    } finally {
      setDisabled(false);
    }
  };

  const handlePickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Sorry, we need camera roll permissions to let you pick an image!',
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        const { uri } = result.assets[0];

        // use FileSystem to read in base64 string
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        setProfilePic(base64);
        handleUpdateProfile('profilePic', base64);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const data: lineDataItem[] = [
    { value: 15 },
    { value: 30 },
    { value: 26 },
    { value: 40 },
    { value: 26 },
  ];

  const pp = useMemo(
    () =>
      profilePic ? 'data:image/png;base64,' + profilePic : userData?.profilePic,
    [profilePic, userData],
  );

  const { theme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [newDate, setNewDate] = useState(new Date());
  const [points, setPoints] = useState('' as any);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const time = useMemo<string>(() => {
    const minutes = (points || 0) * config.minutesPerPoint;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}min`;
  }, [points]);

  const handleAddEntry = async () => {
    if (!token) {
      Alert.alert('You need to be logged in to add a gym entry');
      return;
    }
    try {
      // Replace with your actual API URL
      const { data } = await config.axiosBase(token).post('/gym-entry', {
        date: newDate.toISOString(),
        points: points,
        type: 'GYM', // Assuming same type as the current gymEntry
        // notes: '', // Or some default notes
      });

      console.log('Added new gym entry:', data);

      setUserData({
        ...userData!,
        ...data,
      });

      // Close the modal
      setModalVisible(false);
      setPoints('' as any);
      setNewDate(new Date());
    } catch (error) {
      console.log('Error adding new gym entry:', error);
      if (isAxiosError(error)) {
        Alert.alert('ahia', getError(error.response?.data.type));
      }
    }
  };

  const colorScheme = useColorScheme();

  useEffect(() => {
    if (points && points > 32) {
      Alert.alert(
        `ma sei pazzo?? ti sei allenato ${Math.ceil(
          (points * config.minutesPerPoint) / 60,
        )} ore in un giorno??`,
      );
      setPoints('' as any);
    }
  }, [points]);

  return (
    <>
      <StackScreen title={'Εγώ'} />
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Container>
          <View style={styles.titleContainer}>
            <TouchableOpacity onPress={handlePickImage}>
              {pp ? (
                <Avatar source={{ uri: pp }} rounded size='large' />
              ) : userData?.username ? (
                <Avatar
                  title={userData.username.slice(0, 2)}
                  containerStyle={{ backgroundColor: 'blue' }}
                  rounded
                  size='large'
                />
              ) : (
                <Icon size={64} name='user' type='font-awesome' />
              )}
              <Icon
                name='edit'
                type='font-awesome'
                size={20}
                containerStyle={styles.editIcon}
                onPress={handlePickImage}
              />
            </TouchableOpacity>
            <View style={styles.titleTextContainer}>
              {editingUsername ? (
                <View style={styles.usernameContainer}>
                  <TextInput
                    value={newUsername}
                    onChangeText={setNewUsername}
                    onBlur={() => handleUpdateProfile('username', newUsername)}
                    autoFocus
                  />
                </View>
              ) : (
                <View style={styles.usernameContainer}>
                  <ThemedText
                    style={styles.title}
                    onPress={() => setEditingUsername(true)}
                  >
                    {userData?.username || 'User'}
                  </ThemedText>
                  <Icon
                    name='edit'
                    type='font-awesome'
                    size={20}
                    containerStyle={styles.editIcon}
                    onPress={() => setEditingUsername(true)}
                  />
                </View>
              )}
              {!!userData?.createdAt ? (
                <ThemedText light style={styles.subtitle}>
                  Pusha da{' '}
                  <ThemedText bold>
                    {dayjs(userData.createdAt).locale('it').fromNow(true)}
                  </ThemedText>
                </ThemedText>
              ) : (
                <ThemedText style={styles.subtitle}>Membro da boh</ThemedText>
              )}
            </View>
          </View>

          {!!userData?.gymEntries.length && (
            <View style={styles.chart}>
              <LineChart
                data={data}
                color={'#177AD5'}
                thickness={3}
                dataPointsColor={'green'}
                curved
                xAxisLabelTexts={['Jan', 'Feb', 'Mar', 'Apr', 'May']}
              />
              <GymEntryCard gymEntry={userData.gymEntries[0]} />
            </View>
          )}

          <Pressable
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.69 : 1.0,
              },
              {
                backgroundColor: theme.colors.primary,
                ...styles.addButtonContainer,
              },
            ]}
            onPress={() => setModalVisible(true)}
          >
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: 8,
                alignItems: 'center',
              }}
            >
              <Icon
                name='plus'
                type='font-awesome'
                color={theme.colors.white}
                size={24}
                onPress={() => setModalVisible(true)}
                containerStyle={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              />
              <ThemedText
                style={{
                  marginBottom: 4,
                  fontSize: 16,
                  fontWeight: 'bold',
                }}
              >
                Nuovo allenamento
              </ThemedText>
            </View>
          </Pressable>

          <View style={styles.logout}>
            <Button
              buttonStyle={styles.button}
              title='Logout'
              onPress={signOut}
            />
          </View>
        </Container>
      </ScrollView>

      {/* Modal for adding a new entry */}
      <Modal
        animationType='slide'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Card
            containerStyle={{
              width: '90%',
              borderRadius: 8,
              backgroundColor:
                colorScheme === 'dark'
                  ? theme.colors.black
                  : theme.colors.white,
              borderColor:
                colorScheme === 'dark' ? theme.colors.grey3 : undefined,
            }}
          >
            <ThemedText
              style={{ marginBottom: 16, fontSize: 18, fontWeight: 'bold' }}
            >
              Aggiungi allenamento
            </ThemedText>

            <TextInput
              autoComplete='off'
              placeholder='Punti'
              keyboardType='numeric'
              value={points.toString()}
              onChangeText={(e) =>
                setPoints(parseInt(e.replace(/\D/g, '')) || ('' as any))
              }
              style={{ marginBottom: 16 }}
            />

            <Button
              title={'Data: ' + dayjs(newDate).format('DD/MM')}
              onPress={() => setShowDatePicker(true)}
            />
            {/* this will crash in Expo dev */}
            {/* {showDatePicker && (
              <DatePicker
                modal
                open={showDatePicker}
                date={newDate}
                mode='date'
                onConfirm={(date) => {
                  setNewDate(date);
                  setShowDatePicker(false);
                }}
                onCancel={() => setShowDatePicker(false)}
              />
            )} */}

            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 16,
                marginBottom: 8,
              }}
            >
              <View style={{ flex: 1 }}>
                <Button
                  title='Annulla'
                  onPress={() => setModalVisible(false)}
                  type='clear'
                  buttonStyle={{
                    backgroundColor: 'transparent',
                  }}
                  titleStyle={{
                    color: theme.colors.error,
                  }}
                />
              </View>

              <Button
                title={`+${points || 0} punt${points === 1 ? 'o' : 'i'}${
                  time ? ` (${time})` : ''
                }`}
                onPress={handleAddEntry}
                disabled={disabled || points <= 0}
                buttonStyle={{
                  backgroundColor: theme.colors.primary,
                }}
              />
            </View>
          </Card>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 24,
  },
  titleTextContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    maxWidth: 200,
  },
  chart: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  logout: {
    marginTop: 24,
  },
  button: {
    marginTop: 16,
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: '#B80404',
  },
  usernameInput: {
    borderWidth: 0,
    paddingVertical: 0,
  },
  editIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    padding: 4,
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  // at bottom right of screen
  addButtonContainer: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 32,
  },
});
