// Custom API Compatibility Client for local PostgreSQL Express backend
// This replaces the real Supabase Client to avoid refactoring existing React components.

class QueryBuilder {
  private tableName: string;
  private selects: string = '*';
  private filters: Record<string, any> = {};
  private orders: string[] = [];
  private isSingle: boolean = false;
  private method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET';
  private payload: any = null;
  private countOption: string | null = null;
  private isHead: boolean = false;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  select(columns: string = '*', options?: { count?: 'exact' | 'planned' | 'estimated'; head?: boolean }) {
    this.selects = columns;
    this.method = 'GET';
    if (options?.count) {
      this.countOption = options.count;
    }
    if (options?.head) {
      this.isHead = options.head;
    }
    return this;
  }

  insert(data: any) {
    this.payload = Array.isArray(data) ? data[0] : data;
    this.method = 'POST';
    return this;
  }

  update(data: any) {
    this.payload = data;
    this.method = 'PUT';
    return this;
  }

  delete() {
    this.method = 'DELETE';
    return this;
  }

  eq(column: string, value: any) {
    this.filters[column] = value;
    return this;
  }

  order(column: string, options?: { ascending?: boolean }) {
    const direction = options?.ascending === false ? 'desc' : 'asc';
    this.orders.push(`${column}:${direction}`);
    return this;
  }

  single() {
    this.isSingle = true;
    return this;
  }

  // Thenable implementation to support direct await calls: await supabase.from('table').select('*')
  async then(resolve: (value: any) => void) {
    try {
      const baseUrl = ''; // Now handled by Vite proxy or relative in prod
      let url = `${baseUrl}/api/${this.tableName}`;
      const queryParams = new URLSearchParams();
      if (this.isSingle) {
        queryParams.append('single', 'true');
      }

      // Add filters
      for (const [key, value] of Object.entries(this.filters)) {
        queryParams.append(key, String(value));
      }

      // Add sorting
      if (this.orders.length > 0) {
        queryParams.append('order', this.orders[0]);
      }

      const queryString = queryParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // Retrieve local authentication token
      const token = localStorage.getItem('ledprisha_auth_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const fetchOptions: RequestInit = {
        method: this.method,
        headers,
      };

      if (this.method === 'POST' || this.method === 'PUT') {
        fetchOptions.body = JSON.stringify(this.payload);
      }

      const res = await fetch(url, fetchOptions);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        resolve({ data: null, error: { message: errorData.error || 'Database operation failed' }, count: 0 });
        return;
      }

      const data = await res.json();
      const countValue = Array.isArray(data) ? data.length : data ? 1 : 0;
      
      resolve({ 
        data: this.isHead ? null : data, 
        error: null,
        count: countValue 
      });
    } catch (err: any) {
      console.error(`Local API call error on table ${this.tableName}:`, err.message);
      resolve({ data: null, error: { message: err.message }, count: 0 });
    }
  }
}

const authListeners = new Set<(event: string, session: any) => void>();

const customAuth = {
  async signInWithPassword({ email, password }: any) {
    try {
      const baseUrl = ''; // Relative path
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const body = await res.json();
      if (!res.ok || body.error) {
        return { data: null, error: body.error || { message: 'Invalid credentials' } };
      }

      // Persist locally
      localStorage.setItem('ledprisha_auth_token', body.session.access_token);
      localStorage.setItem('ledprisha_auth_user', JSON.stringify(body.session.user));

      // Notify auth state subscribers
      authListeners.forEach((listener) => listener('SIGNED_IN', body.session));

      return { data: body, error: null };
    } catch (err: any) {
      return { data: null, error: { message: err.message } };
    }
  },

  async signOut() {
    try {
      const baseUrl = import.meta.env.VITE_SUPABASE_URL || 'http://localhost:5000';
      await fetch(`${baseUrl}/api/auth/logout`, { method: 'POST' });
    } catch (e) {}

    localStorage.removeItem('ledprisha_auth_token');
    localStorage.removeItem('ledprisha_auth_user');

    // Notify auth state subscribers
    authListeners.forEach((listener) => listener('SIGNED_OUT', null));

    return { error: null };
  },

  async getSession() {
    try {
      const token = localStorage.getItem('ledprisha_auth_token');
      const userStr = localStorage.getItem('ledprisha_auth_user');

      if (!token || !userStr) {
        return { data: { session: null }, error: null };
      }

      const user = JSON.parse(userStr);
      return {
        data: {
          session: {
            access_token: token,
            user,
          },
        },
        error: null,
      };
    } catch (e) {
      return { data: { session: null }, error: null };
    }
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    authListeners.add(callback);

    // Immediately trigger with current session context
    this.getSession().then(({ data }) => {
      callback('INITIAL_SESSION', data.session);
    });

    return {
      data: {
        subscription: {
          unsubscribe() {
            authListeners.delete(callback);
          },
        },
      },
    };
  },
};

export const supabase = {
  from(tableName: string) {
    return new QueryBuilder(tableName);
  },
  auth: customAuth,
};
