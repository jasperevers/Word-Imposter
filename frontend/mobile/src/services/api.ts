// Als je in development bent, gebruik je lokale IP
const API_URL = 'http://192.168.2.29:8080/api/lobby';  // Voor Android Emulator
// OF
// const API_URL = 'http://localhost:8080/api/lobby';  // Voor web testing

export const api = {
    createLobby: async (): Promise<{ code: string }> => {
        try {
            console.log('Sending request to:', `${API_URL}/create`);
            const response = await fetch(`${API_URL}/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server response:', errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Create lobby response:', data);
            return data;
        } catch (error) {
            console.error('Create lobby error:', error);
            throw error;
        }
    },

    joinLobby: async (code: string, name: string) => {
        try {
            console.log('Sending join request:', { code, name });
            const response = await fetch(`${API_URL}/${code}/join`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ name })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server response:', errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Join lobby response:', data);
            return data;
        } catch (error) {
            console.error('Join lobby error:', error);
            throw error;
        }
    }
};