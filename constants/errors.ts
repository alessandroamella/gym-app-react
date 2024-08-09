export const errors = {
  'auth.telegram_auth_date_expired':
    'La data di autenticazione Telegram è scaduta. Per favore, riprova.',
  'auth.telegram_hash_mismatch':
    'Errore di autenticazione Telegram. La verifica di sicurezza non è riuscita.',
  'auth.user_not_found':
    'Utente non trovato. Assicurati di essere registrato nel sistema.',
  'user.profile_pic_decoding_error':
    "Si è verificato un errore durante l'elaborazione dell'immagine del profilo. Prova con un'altra immagine.",
  'gym_entry.already_exists':
    'Esiste già un log per la palestra in questa data. Puoi modificare quella esistente :)',
  'gym_entry.media_type_not_supported':
    'Il tipo di file multimediale non è supportato. Usa solo immagini o video nei formati consentiti.',
  generic: 'Si è verificato un errore. Per favore, riprova.',
};

export const getError = (key: unknown) => {
  return typeof key === 'string' && key in errors
    ? errors[key as keyof typeof errors]
    : errors['generic'];
};
