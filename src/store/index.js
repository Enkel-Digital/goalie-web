import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import apiWithLoader from "./utils/apiWithLoader";
import apiError from "./utils/apiError";

import initialState from "./initialState";
import setter from "./utils/setter";

import linksModule from "./module/links";
// import subscriptionPlanModule from "./module/subscriptionPlan";

Vue.use(Vuex);

export default new Vuex.Store({
  strict: process.env.NODE_ENV.toLowerCase() !== "production",
  state: initialState(),
  modules: {
    links: linksModule,
    // subscription: subscriptionPlanModule,
  },
  mutations: {
    setter,
  },
  actions: {
    // Action to be only called after firebase auth successfully signs in, in Login and Signup views
    async signin({ dispatch }, email) {
      // await as getUserDetails must complete before init should be called
      await dispatch("getUserDetails", email);
      dispatch("init");
    },
    /**
     * Main init function of store that calls all the other init actions from all the modules
     * @function init
     */
    async init({ dispatch }) {
      console.log("Initializing vuex store and its modules...");

      dispatch("bots/getBots");
    },
    /**
     * Function to get all the user's details
     * @function getUserDetails
     */
    async getUserDetails({ commit }, email) {
      email = email.toLowerCase();

      const response = await apiWithLoader.get(`/user/${email}`);
      if (!response.ok)
        return apiError(response, (self) =>
          self.$store.dispatch("getUserDetails", email)
        );

      commit("setter", ["user", response.user]);
    },
  },
  plugins: [
    /* Note that createPersistedState use the same key "vuex" in storage, but they do not clash as they use different storage APIs */
    // Register modules for persistent state using localStorage
    createPersistedState({
      paths: [
        "user",
        "bots",
        "reviews", // Might want to move this to session storage
        // "subscription",
      ],
    }),
    // Register modules for persistent state using sessionStorage
    createPersistedState({
      storage: window.sessionStorage,
      paths: [""],
    }),
  ],
});