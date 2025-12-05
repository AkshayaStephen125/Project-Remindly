// apolloClient.js
import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';


const httpLink = new HttpLink({
  uri: "http://127.0.0.1:8000/graphql/",
});

const authLink = setContext((prevContext, operation) => {
  const token = localStorage.getItem("accessToken");
  return {
    headers: {
      ...prevContext.headers,
      authorization: token ? `JWT ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: ApolloLink.from([authLink, httpLink]),
  cache: new InMemoryCache(),
});



export default client;