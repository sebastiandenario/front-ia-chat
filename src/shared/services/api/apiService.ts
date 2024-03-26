export const getApiData = async (endpoint: string) => {
    const response = await fetch(`http://localhost:8000/${endpoint}`);
    if (!response.ok) {
        throw new Error(`An error has occurred: ${response.status}`);
    }
    return await response.json();
};

export const postApiData = async (endpoint: string, data: any) => {
    console.log('body: ', JSON.stringify(data));
    const response = await fetch(`http://localhost:8000/${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        throw new Error(`An error has occurred: ${response.status}`);
    }
    return await response.json();
}