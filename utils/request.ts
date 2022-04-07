import * as axios from 'axios';
import Constants from 'expo-constants';

const request = axios.default.create({
    baseURL: Constants.manifest.extra.host,
});

export default request;
