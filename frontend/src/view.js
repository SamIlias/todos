/* eslint-disable no-param-reassign, no-unused-vars */

import $ from 'jquery';

const initView = (body, state) => {
  const submitButton = $('#todo-submit', body);
  const nameInput = $('#todo-input', body);
  const descriptionInput = $('#description-input', body);
  const nameFeedbackContainer = $('<div></div>').addClass('invalid-feedback');
  const descriptionFeedbackContainer =
    $('<div></div>').addClass('invalid-feedback');

  nameInput.after(nameFeedbackContainer);
  descriptionInput.after(descriptionFeedbackContainer);

  nameFeedbackContainer.hide();
  descriptionFeedbackContainer.hide();

  const ul = $('#todos');
  const toast = $('.toast', body);

  const disableElements = els => {
    els.forEach(el => {
      el.disabled = true;
    });
  };

  const enableElements = els => {
    els.forEach(el => {
      el.disabled = false;
    });
  };

  const formStateFns = {
    input: () => enableElements([nameInput, descriptionInput, submitButton]),
    sending: () => {
      disableElements([nameInput, descriptionInput, submitButton]);
      nameInput.val('');
      descriptionInput.val('');
    },
  };

  return (path, value, prevValue) => {
    if (path === 'nameInput.state') {
      nameInput.removeClass('is-valid');
      nameInput.removeClass('is-invalid');
      nameInput.addClass(value);
    }

    if (path === 'descriptionInput.state') {
      descriptionInput.removeClass('is-valid');
      descriptionInput.removeClass('is-invalid');
      descriptionInput.addClass(value);
    }

    if (path === 'formState') {
      formStateFns[value]();
    }

    if (path === 'nameInput.error') {
      nameFeedbackContainer.text(value || '').toggle(!!value);
    }

    if (path === 'descriptionInput.error') {
      descriptionFeedbackContainer.text(value || '').toggle(!!value);
    }

    if (path === 'appErrors') {
      if (value) {
        toast.addClass('show');
      } else {
        toast.removeClass('show');
      }
    }

    if (path === 'todosList') {
      ul.empty();
      state.todosList.forEach(todo => {
        const li = $('<li></li>');
        li.text(`${todo.name}: ${todo.description}`);
        ul.append(li);
      });
    }
  };
};

export default initView;
