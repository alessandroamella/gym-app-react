import { useAuth } from '@/components/AuthProvider';
import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
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
import { AxiosError } from 'axios';
import { UserData } from '../types';
import GymEntryCard from '@/components/GymEntryCard';
import DatePicker from 'react-native-date-picker';

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

  const handleUpdateProfile = async (key: keyof UserData, val: string) => {
    if (!token) {
      Alert.alert('You need to be logged in to update your profile');
      return;
    }
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
  const [points, setPoints] = useState(0);
  const [showDatePicker, setShowDatePicker] = useState(false);

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

      setUserData({
        ...userData!,
        ...data,
      });

      // Close the modal
      setModalVisible(false);
      setPoints(0);
    } catch (error) {
      console.error('Error adding new gym entry:', error);
    }
  };

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

          <Icon
            name='plus'
            type='font-awesome'
            color={theme.colors.primary}
            size={24}
            containerStyle={{ position: 'absolute', top: 16, right: 16 }}
            onPress={() => setModalVisible(true)}
          />

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
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
        >
          <Card containerStyle={{ width: '90%', borderRadius: 8 }}>
            <ThemedText
              style={{ marginBottom: 16, fontSize: 18, fontWeight: 'bold' }}
            >
              Add New Gym Entry
            </ThemedText>

            <Input
              placeholder='Points'
              keyboardType='numeric'
              value={points.toString()}
              onChangeText={(e) => setPoints(parseInt(e))}
              containerStyle={{ marginBottom: 16 }}
            />

            <Button
              title={dayjs(newDate).format('DD/MM')}
              onPress={() => setShowDatePicker(true)}
            />
            {/* this will crash in Expo dev */}
            {showDatePicker && (
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
            )}

            <Button
              title='Add Entry'
              onPress={handleAddEntry}
              disabled={points <= 0}
              buttonStyle={{
                backgroundColor: theme.colors.primary,
                marginTop: 16,
              }}
            />

            <Button
              title='Cancel'
              onPress={() => setModalVisible(false)}
              type='clear'
              titleStyle={{ color: theme.colors.secondary }}
            />
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
});
