export const apiPromise = async (url, option = {}) => {

    const isFormData = option.objectBody instanceof FormData;

    const headers = {
        'Accept' : 'application/json',
        'Authorization': option.token ? `Bearer ${option.token}` : undefined
    }

    if (!isFormData) {
        headers['Content-Type'] = 'application/json';
    }
    
    const res = await fetch(`${url}`, {
            method: option.requestMethod,
            headers: headers,
            body: isFormData ? option.objectBody : (option.objectBody ? JSON.stringify(option.objectBody) : undefined)
        });

        const data = await res.json();

        
        if (!res.ok) {
            const errorData = data.errors || data.message;
            throw errorData;
        }

        return data; 
}
        