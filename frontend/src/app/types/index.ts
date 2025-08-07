export interface Message {
    _id: string;
    from: string;
    id: string;
    timestamp: string;
    text: {
      body: string;
    };
    type: string;
    status: 'sent' | 'delivered' | 'read';
    wa_id: string;
    name: string;
  }
  
  export interface Chat {
    wa_id: string;
    name: string;
    messages: Message[];
  }
  
  export interface Chats {
    [key: string]: Chat;
  }