export const sessionKey = "sai_session";

export const getSessionKey = (): string => {
  const sessionData = localStorage.getItem(sessionKey);
  let sessionObj: { key: string; timestamp: number } = {
    key: "",
    timestamp: 0,
  };

  // Check if session data exists and not expired
  if (sessionData) {
    sessionObj = JSON.parse(sessionData);
    if (Date.now() - sessionObj.timestamp <= 30 * 60 * 1000) {
      return sessionObj.key; // Return existing session key if not expired
    }
  }

  // Generate new session key
  const newSessionKey = generateSessionKey();
  sessionObj = { key: newSessionKey, timestamp: Date.now() };
  localStorage.setItem(sessionKey, JSON.stringify(sessionObj));
  return newSessionKey;
};

export const generateSessionKey = (): string => {
  // Generate a random alphanumeric session key
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let key = "";
  for (let i = 0; i < 10; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return sessionKey + "_" + key;
};

export const getKeyInSession = (key: string): string | null => {
  const sessionKey = getSessionKey();
  DEV: console.log("sessionKey", sessionKey);
  const sessionData = localStorage.getItem(sessionKey);
  if (sessionData) {
    const sessionObj = JSON.parse(sessionData);
    return sessionObj[key] || null;
  }
  return null;
};

export const setKeyInSession = (key: string, value: string): void => {
  const sessionKey = getSessionKey();
  DEV: console.log("sessionKey", sessionKey);
  let sessionObj: { [key: string]: string } = {};
  const sessionData = localStorage.getItem(sessionKey);
  if (sessionData) {
    sessionObj = JSON.parse(sessionData);
  }
  sessionObj[key] = value;
  localStorage.setItem(sessionKey, JSON.stringify(sessionObj));
};

export const resetSession = (): void => {
  localStorage.removeItem(sessionKey);
};
