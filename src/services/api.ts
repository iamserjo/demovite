import axios from 'axios';

const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
}

export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export interface Photo {
  id: number;
  albumId: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

// Function to generate extra mock users
const generateMockUsers = (baseUsers: User[]): User[] => {
  const result: User[] = [...baseUsers];
  const lastId = baseUsers.length;
  
  // Generate 990 more users to reach 1000 total
  for (let i = lastId + 1; i <= 1000; i++) {
    result.push({
      id: i,
      name: `User ${i}`,
      email: `user${i}@example.com`,
      username: `user${i}`,
    });
  }
  
  return result;
};

const api = {
  users: {
    getAll: async () => {
      const response = await axios.get<User[]>(`${API_BASE_URL}/users`);
      const extendedUsers = generateMockUsers(response.data);
      return { data: extendedUsers };
    },
  },
  todos: {
    getAll: () => axios.get<Todo[]>(`${API_BASE_URL}/todos`),
    create: (todo: Omit<Todo, 'id'>) => axios.post<Todo>(`${API_BASE_URL}/todos`, todo),
    update: (todo: Todo) => axios.put<Todo>(`${API_BASE_URL}/todos/${todo.id}`, todo),
    delete: (id: number) => axios.delete(`${API_BASE_URL}/todos/${id}`),
  },
  photos: {
    getAll: () => axios.get<Photo[]>(`${API_BASE_URL}/photos`),
  },
};

export default api; 