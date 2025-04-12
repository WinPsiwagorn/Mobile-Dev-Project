export type User = {
  id: string
  name: string
  email: string
  avatar?: string
  phoneNumber?: string
  currency: string
  language: string
  notifications: {
    push: boolean
    email: boolean
    sms: boolean
  }
  preferences: {
    darkMode: boolean
    biometricLogin: boolean
  }
  subscription: {
    type: "free" | "premium"
    validUntil?: string
  }
}

export const mockUser: User = {
  id: "1",
  name: "John Doe",
  email: "john.doe@example.com",
  phoneNumber: "+1 (555) 123-4567",
  currency: "USD",
  language: "English",
  notifications: {
    push: true,
    email: true,
    sms: false,
  },
  preferences: {
    darkMode: false,
    biometricLogin: true,
  },
  subscription: {
    type: "premium",
    validUntil: "2024-12-31",
  },
}
