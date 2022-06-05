import axios from 'axios';

const fetcher = (url: string) => axios.get(url, { withCredentials: true }).then((response) => response.data);
// fetcherPost = (url :string, data? : obejct) => axios.get(url, {withCrednetials : ture}) ...
export default fetcher;
