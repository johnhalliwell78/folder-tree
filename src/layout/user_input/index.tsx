import React from 'react';
import { Tag, Input, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import './styles.less';

class EditableTagGroup extends React.Component {
  state = {
    tags: ['Me'],
    inputVisible: false,
    inputValue: '',
    editInputIndex: -1,
    editInputValue: ''
  };

  handleClose = (removedTag: string) => {
    const tags = this.state.tags.filter(tag => tag !== removedTag);
    console.log(tags);
    this.setState({ tags });
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  handleInputChange = (e: { target: { value: any } }) => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const { inputValue } = this.state;
    let { tags } = this.state;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    console.log(tags);
    this.setState({
      tags,
      inputVisible: false,
      inputValue: ''
    });
  };

  handleEditInputChange = (e: { target: { value: any } }) => {
    this.setState({ editInputValue: e.target.value });
  };

  handleEditInputConfirm = () => {
    // this.setState(({ tags, editInputIndex, editInputValue }) => {
    //   const newTags = [...tags];
    //   newTags[editInputIndex] = editInputValue;
    //   return {
    //     tags: newTags,
    //     editInputIndex: -1,
    //     editInputValue: ''
    //   };
    // });
  };

  saveInputRef = (input: any) => {
    this.input = input;
  };

  saveEditInputRef = (input: any) => {
    this.editInput = input;
  };
  input: any;
  editInput: any;

  render() {
    const { tags, inputVisible, inputValue, editInputIndex, editInputValue } = this.state;
    return (
      <div className="user-input">
        {tags.map((tag, index) => {
          if (editInputIndex === index) {
            return (
              <Input
                ref={this.saveEditInputRef}
                key={tag}
                size="small"
                className="tag-input"
                value={editInputValue}
                onChange={this.handleEditInputChange}
                onBlur={this.handleEditInputConfirm}
                onPressEnter={this.handleEditInputConfirm}
              />
            );
          }

          const isLongTag = tag.length > 20;

          const tagElem = (
            <Tag
              className="edit-tag"
              key={tag}
              closable={index !== 0}
              onClose={() => this.handleClose(tag)}
            >
              <span
                onDoubleClick={e => {
                  if (index !== 0) {
                    this.setState({ editInputIndex: index, editInputValue: tag }, () => {
                      this.editInput.focus();
                    });
                    e.preventDefault();
                  }
                }}
              >
                {isLongTag ? `${tag.slice(0, 20)}...` : tag}
              </span>
            </Tag>
          );
          return isLongTag ? (
            <Tooltip title={tag} key={tag}>
              {tagElem}
            </Tooltip>
          ) : (
            tagElem
          );
        })}
        {inputVisible && (
          <Input
            ref={this.saveInputRef}
            type="text"
            size="small"
            className="tag-input"
            value={inputValue}
            onChange={this.handleInputChange}
            onBlur={this.handleInputConfirm}
            onPressEnter={this.handleInputConfirm}
          />
        )}
        {!inputVisible && (
          <Tag className="site-tag-plus" onClick={this.showInput}>
            <PlusOutlined /> Add a User
          </Tag>
        )}
      </div>
    );
  }
}

export default EditableTagGroup;
