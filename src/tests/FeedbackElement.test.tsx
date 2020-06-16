import serializer from 'jest-emotion';
import React from 'react';
import renderer from 'react-test-renderer';
import FeedbackElement from '../components/FeedbackInput/FeedbackElement';
import { FeedbackStatus } from '../ducks/toast/ToastTypes';

expect.addSnapshotSerializer(serializer);

describe('FeedbackElement', () => {
  it('hidden', () => {
    const view = renderer
      .create(
        <FeedbackElement
          state={{
            status: FeedbackStatus.HIDDEN,
          }}
        >
          <div>Hidden</div>
        </FeedbackElement>
      )
      .toJSON();
    expect(view).toMatchSnapshot();
  });

  it('error', () => {
    const view = renderer
      .create(
        <FeedbackElement
          state={{
            status: FeedbackStatus.ERROR,
            message: 'An Error Message',
          }}
        >
          <div>Error</div>
        </FeedbackElement>
      )
      .toJSON();
    expect(view).toMatchSnapshot();
  });

  it('warn', () => {
    const view = renderer
      .create(
        <FeedbackElement
          state={{
            status: FeedbackStatus.WARN,
            message: 'A Warning message',
          }}
        >
          <div>Warn</div>
        </FeedbackElement>
      )
      .toJSON();
    expect(view).toMatchSnapshot();
  });

  it('info', () => {
    const view = renderer
      .create(
        <FeedbackElement
          state={{
            status: FeedbackStatus.INFO,
            message: 'An Information message',
          }}
        >
          <div>Info</div>
        </FeedbackElement>
      )
      .toJSON();
    expect(view).toMatchSnapshot();
  });

  it('disable', () => {
    const view = renderer
      .create(
        <FeedbackElement
          state={{
            status: FeedbackStatus.DISABLED,
            message: 'A disabled message',
          }}
        >
          <div>Disabled</div>
        </FeedbackElement>
      )
      .toJSON();
    expect(view).toMatchSnapshot();
  });
});
