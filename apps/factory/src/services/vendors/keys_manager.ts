class KeyManager {
  private apiKeys: string[];

  constructor(apiKeys: string[]) {
    this.apiKeys = apiKeys;
  }

  getCurrentApiKey() {
    const currentTime = Math.floor(Date.now() / 1000); // Convert milliseconds to seconds
    const index = currentTime % this.apiKeys.length;
    console.debug(
      `Current time: ${currentTime}, index: ${index}, keys len: ${this.apiKeys.length}`,
    );
    return this.apiKeys[index];
  }
}

export default KeyManager;
