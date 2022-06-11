import axios from 'axios';

const fetcher = (url: string) =>
  axios
    .get(url, { withCredentials: true })
    .then((response) => response.data)
    .catch((error) => {
      console.error(error);
      return error;
    });
// fetcherPost = (url :string, data? : obejct) => axios.get(url, {withCrednetials : ture}) ...
export default fetcher;
