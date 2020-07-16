import classNames from 'classnames';
import React, { ReactNode } from 'react';

import { ErrorState, FeedbackStatus } from '../../ducks/toast/ToastTypes';
import { nullOrEmptyString } from '../../helpers/string';
import { EmotionProps } from '../../styles/types';
import AutoCompleteInput from '../AutoCompleteInput/AutoCompleteInput';
import FeedbackElement from '../FeedbackInput/FeedbackElement';
import Loading from '../Loading/Loading';
import { EditItemProps } from './EditItemTypes';
import { editBoxStyle, styledEditItem } from './StyledEditItem';

const EditItem = <
  T extends { id?: string; name?: string; localId: string },
  ApiT
>(
  props: EmotionProps & EditItemProps<T, ApiT> & { children?: ReactNode }
) => {
  const {
    itemName,
    search,
    allItems,
    isLoading,
    selectedItem,
    handleItemUpdate,
    fetchAllItems,
    handleItemClear,
    isItemEdited,
  } = props;
  const prevSearch = {
    text: '',
    results: false,
  };

  const getOptions = async (text: string) => {
    const results = await search(
      text,
      allItems,
      prevSearch.results,
      prevSearch.text
    );

    if (text !== prevSearch.text) {
      prevSearch.text = text;
      prevSearch.results = Boolean(results.length);
    }

    return results;
  };

  const getEditState = (): ErrorState => {
    return isItemEdited
      ? {
          status: FeedbackStatus.WARN,
          message: `${itemName} has been edited`,
        }
      : {
          status: FeedbackStatus.INFO,
          message: `${itemName} Selected For Editing`,
        };
  };

  return (
    <>
      <Loading isLoading={isLoading}>
        <div className={classNames('edit-item', props.className)}>
          <h2 className="title">{`Select a ${itemName} to edit`}</h2>
          <div>
            <AutoCompleteInput
              className="item-name"
              placeholder="Search or select from list"
              disabled={!nullOrEmptyString(selectedItem?.id)}
              getOptions={getOptions}
              updateCurrentValue={handleItemUpdate}
              currentValue={selectedItem}
              onDirty={() => null}
              allItems={allItems}
              allItemsLoading={isLoading}
              fetchAll={fetchAllItems}
              allowUserDefinedInput={false}
            />
            <button className="clear-button" onClick={handleItemClear}>
              Clear
            </button>
          </div>
          {selectedItem?.id != null && (
            <div>
              <h2>{`Edit ${itemName}`}</h2>
              <FeedbackElement
                className="edit"
                state={getEditState()}
                styles={editBoxStyle}
              >
                <div className="edit-box">{props.children}</div>
              </FeedbackElement>
            </div>
          )}
        </div>
      </Loading>
    </>
  );
};

export default styledEditItem(
  EditItem as React.ComponentType
) as typeof EditItem;
