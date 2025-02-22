/* eslint-disable no-param-reassign */
// import 'dotenv/config';
import axios from 'axios';
import * as yup from 'yup';
import onChange from 'on-change';
import initView from './view.js';

const BACKEND_PORT = 3000;
// const BACKEND_PORT = process.env.BACKEND_PORT || 3000;
// const API_URL = `http://localhost:${BACKEND_PORT}/todos`;
const API_URL = `http://localhost:${BACKEND_PORT}/todos`;

const app = async () => {
  const state = {
    submitState: 'input', // 'sending'
    inputForm: {
      state: null,
      data: {
        currentTodo: '',
      },
      errors: { input: null },
    },
    todosList: [],
    appErrors: null,
  };

  const { body } = document;
  const form = document.getElementById('todo-form');
  const input = form.querySelector('#todo-input');

  const render = initView(body, state);
  const watchedState = onChange(state, render);

  await axios
    .get(API_URL)
    .then(res => {
      // console.log(res.data);
      watchedState.todosList = res.data;
    })
    .catch(err => {
      watchedState.appErrors = err.message;
    });

  const inputValueSchema = yup.string().min(3).max(10).required();

  const validateField = async (schema, value, dataHandler, errorHandler) => {
    try {
      const data = await schema.validate(value);
      dataHandler(data);
    } catch (err) {
      errorHandler(err);
    }
  };

  const inputValueHandler = value => {
    watchedState.inputForm.state = 'is-valid';
    watchedState.inputForm.data.currentTodo = value;
  };

  const inputErrorHandler = err => {
    watchedState.inputForm.state = 'is-invalid';
    watchedState.inputForm.errors.input = err.message;
  };

  const nullifyObj = obj => {
    Object.keys(obj).forEach(key => {
      obj[key] = null;
    });
  };

  input.addEventListener('input', async () => {
    nullifyObj(watchedState.inputForm.errors);
    validateField(
      inputValueSchema,
      input.value,
      inputValueHandler,
      inputErrorHandler,
    );
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const todoName = watchedState.inputForm.data.currentTodo;
    if (!todoName) {
      return;
    }

    watchedState.submitState = 'sending';
    const dataToSend = { todo: { name: todoName } };

    await axios
      .post(API_URL, dataToSend)
      .then(res => {
        // console.log(res.data); // todo
      })
      .catch(err => {
        watchedState.appErrors = err.message;
      });

    await axios
      .get(API_URL)
      .then(res => {
        watchedState.todosList = res.data;
      })
      .catch(err => {
        watchedState.appErrors = err.message;
      });

    watchedState.inputForm.data.currentTodo = null;
    watchedState.submitState = 'input';
  });
};

export default app;
