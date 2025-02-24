/* eslint-disable no-param-reassign */
import axios from 'axios';
import * as yup from 'yup';
import onChange from 'on-change';
import initView from './view.js';

const BACKEND_PORT = 3000;
const API_URL = `http://localhost:${BACKEND_PORT}/todos`;

const app = async () => {
  const state = {
    formState: 'input', // 'sending'
    nameInput: {
      state: null, // is-valid, is-invalid
      data: {
        curValue: '',
      },
      error: null,
    },
    descriptionInput: {
      state: null, // is-valid, is-invalid
      data: {
        curValue: '',
      },
      error: null,
    },
    todosList: [],
    appErrors: null,
  };

  const { body } = document;
  const form = document.getElementById('todo-form');
  const nameInput = form.querySelector('#todo-input');
  const descriptionInput = form.querySelector('#description-input');

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

  const nameValueSchema = yup.string().min(3).max(15).required();
  const descriptionValueSchema = yup.string().min(3).max(45).required();

  const validateField = async (schema, value, dataHandler, errorHandler) => {
    try {
      const data = await schema.validate(value);
      dataHandler(data);
    } catch (err) {
      errorHandler(err);
    }
  };

  const inputDataHandler = input => value => {
    watchedState[input].state = 'is-valid';
    watchedState[input].data.curValue = value;
  };

  const inputErrorHandler = input => err => {
    watchedState[input].state = 'is-invalid';
    watchedState[input].error = err.message;
  };

  nameInput.addEventListener('input', async () => {
    watchedState.nameInput.error = null;
    validateField(
      nameValueSchema,
      nameInput.value,
      inputDataHandler('nameInput'),
      inputErrorHandler('nameInput'),
    );
  });

  descriptionInput.addEventListener('input', async () => {
    watchedState.descriptionInput.error = null;
    validateField(
      descriptionValueSchema,
      descriptionInput.value,
      inputDataHandler('descriptionInput'),
      inputErrorHandler('descriptionInput'),
    );
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const todoName = watchedState.nameInput.data.curValue;
    const nameError = watchedState.nameInput.error;
    const todoDescription = watchedState.descriptionInput.data.curValue;
    const descriptionError = watchedState.descriptionInput.error;

    if (!todoName || nameError || !todoDescription || descriptionError) {
      return;
    }

    watchedState.formState = 'sending';
    const dataToSend = { name: todoName, description: todoDescription };

    try {
      const res = await axios.post(API_URL, dataToSend);
      console.log(res.data.todos);
      watchedState.todosList = res.data.todos;
    } catch (err) {
      watchedState.appErrors = err.message;
    }

    watchedState.nameInput.data.curValue = '';
    watchedState.descriptionInput.data.curValue = '';

    watchedState.formState = 'input';
  });
};

export default app;
