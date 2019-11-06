import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://it-1427:3500',
    timeout: 10000
});
// instance.defaults.headers.common['Authorization'] = 'AUTH TOKEN FROM INSTANCE';


axios.defaults.baseURL = 'http://it-1427:3500';
// instance.defaults.headers.common['Authorization'] = 'AUTH TOKEN';
// instance.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
instance.defaults.headers.post['Content-Type'] = 'application/json';

export default instance;