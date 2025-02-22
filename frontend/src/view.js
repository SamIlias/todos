/* eslint-disable no-param-reassign, no-unused-vars */

import $ from 'jquery';

const initView = (body, state) => {
  const submitButton = $('#todo-submit', body);
  const input = $('#todo-input', body);
  const inputContainer = $('.form-group', body);
  const feedbackContainer = $('<div></div>').addClass('invalid-feedback');
  inputContainer.append(feedbackContainer);
  feedbackContainer.hide();
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

  const submitStateFns = {
    input: () => enableElements([input, submitButton]),
    sending: () => {
      disableElements([input, submitButton]);
      input.val(null);
    },
  };

  return (path, value, prevValue) => {
    if (path === 'inputForm.state') {
      input.removeClass(prevValue);
      input.addClass(value);
    }

    if (path === 'submitState') {
      submitStateFns[value]();
    }

    if (path === 'inputForm.errors.input') {
      feedbackContainer.text(value || '').toggle(!!value);
    }
    // if (path === 'inputForm.errors.input') {
    //   if (value) {
    //     feedbackContainer.show();
    //     feedbackContainer.text(value);
    //   }
    //
    //   if (value === null) {
    //     feedbackContainer.hide();
    //   }
    // }

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
        li.text(todo);
        ul.append(li);
      });
    }
  };
};

export default initView;
