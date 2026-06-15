import React, { useCallback, useState } from 'react';
import { Image, ScrollView, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { RADIUS, useTheme } from '../theme';
import { ZenChrome } from '../components/ZenChrome';
import { Section, Anchor } from '../components/Section';
import { ZenText } from '../components/ZenText';
import { ZenButton } from '../components/ZenButton';
import { Spinner } from '../components/Spinner';
import { api, ApiError } from '../lib/api';
import type { AlbumPhoto } from '../types/api';
import { ScreenProps } from '../navigation/types';

export function AlbumScreen({ route, navigation }: ScreenProps<'Album'>) {
  const t = useTheme();
  const { eventId, title } = route.params;
  const [photos, setPhotos] = useState<AlbumPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(() => {
    let alive = true;
    setLoading(true);
    api
      .getAlbum(eventId)
      .then((a) => alive && setPhotos(a.photos))
      .catch((e: ApiError) => alive && setNotice(e.notConfigured ? 'Shared albums aren’t set up yet.' : e.message))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [eventId]);

  useFocusEffect(load);

  const addPhoto = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      setNotice('Photo library permission is needed to add photos.');
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });
    if (res.canceled || !res.assets?.[0]) return;
    const asset = res.assets[0];
    const contentType = asset.mimeType ?? 'image/jpeg';
    const ext = contentType.split('/')[1] ?? 'jpg';

    setBusy(true);
    setNotice(null);
    try {
      const { uploadUrl, publicUrl } = await api.albumUploadUrl(eventId, { contentType, ext });
      const blob = await (await fetch(asset.uri)).blob();
      const put = await fetch(uploadUrl, { method: 'PUT', headers: { 'Content-Type': contentType }, body: blob });
      if (!put.ok) throw new Error('Upload failed');
      await api.addPhoto(eventId, { url: publicUrl });
      load();
    } catch (e) {
      const err = e as ApiError;
      setNotice(err.notConfigured ? 'Shared albums aren’t set up yet (object storage not configured).' : err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <ZenChrome label="SHARED ALBUM" onBack={() => navigation.goBack()} showMenu={false} />
      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Spinner size={22} borderWidth={2} />
        </View>
      ) : (
        <>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <Section paddingTop={24} gap={18}>
              <ZenText variant="eyebrow" tone="fg3">{title ?? 'EVENT'} · {photos.length} PHOTOS</ZenText>
              {photos.length === 0 ? (
                <ZenText variant="body" tone="fg2">No photos yet. Add the first one below.</ZenText>
              ) : (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {photos.map((p) => (
                    <Image
                      key={p.id}
                      source={{ uri: p.url }}
                      style={{ width: '31.5%', aspectRatio: 1, borderRadius: RADIUS.md, backgroundColor: t.fg3Bg }}
                    />
                  ))}
                </View>
              )}
              {notice ? <ZenText variant="body" tone="fg2">{notice}</ZenText> : null}
            </Section>
          </ScrollView>
          <Anchor>
            <ZenButton label={busy ? 'Uploading…' : 'Add a photo'} variant={busy ? 'disabled' : 'primary'} onPress={addPhoto} />
          </Anchor>
        </>
      )}
    </View>
  );
}
