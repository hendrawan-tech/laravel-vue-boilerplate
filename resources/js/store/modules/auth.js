import axios from 'axios';

export const state = {
  loggedIn: localStorage.getItem('loggedIn') || '',
};

export const getters = {
  loggedIn(state) {
    return !!state.loggedIn;
  },
};

export const mutations = {
  setLoggedIn(state, payload) {
    state.loggedIn = payload;
    localStorage.setItem('loggedIn', payload);
  },
};

export const actions = {
  csrf() {
    return new Promise((resolve, reject) => {
      axios
        .get('/api/sanctum/csrf-cookie')
        .then(({ data }) => resolve(data))
        .catch(({ response }) => reject(response));
    });
  },

  login({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .post('/login', payload)
        .then(({ data }) => {
          commit('setLoggedIn', 'true');
          resolve(data);
        })
        .catch(({ response }) => reject(response));
    });
  },

  logout({ commit }) {
    return new Promise((resolve, reject) => {
      axios
        .post('/logout')
        .then(({ data }) => {
          commit('setLoggedIn', 'false');
          resolve(data);
        })
        .catch(({ response }) => reject(response));
    });
  },

  validate({ commit, state }) {
    if (!state.loggedIn) return Promise.resolve(null);

    return axios
      .get('/api/validate')
      .then(response => {
        commit('setLoggedIn', 'true');

        const { data } = response;
        return data;
      })
      .catch(error => {
        if (error.response && error.response.status === 401) {
          commit('setLoggedIn', null);
        } else {
          console.warn(error);
        }

        return null;
      });
  },
};
