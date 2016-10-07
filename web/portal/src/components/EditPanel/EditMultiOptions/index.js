
// CSS
import styles from './style.css';

import React from 'react';
import PureComponent from 'react-pure-render/component';

import * as values from '../../../constants/DefaultValues';
import Mixins from '../../../mixins/global';
import EditItem from '../EditItem';

class EditMultiOptions extends PureComponent {

    constructor() {
        super();

        this._addOption = this._addOption.bind(this);
        this._onDeleteHandle = this._onDeleteHandle.bind(this);
        this._onChangeHandle = this._onChangeHandle.bind(this);
        this._moveItem = this._moveItem.bind(this);
        this._renderData = this._renderData.bind(this);
        this._handleFocusEvent = this._handleFocusEvent.bind(this);
    }

    render() {
        const { editQuestion } = this.props;
        const data = editQuestion.data;
        let optList = [];
        const otherBtn = [];

        // Once add new question, it should add case content
        switch (editQuestion.type) {
        case 'radio':
        case 'checkbox':
        case 'rating':
            optList = this._renderData(data);
            otherBtn.push(
                <a
                    data-type="other"
                    className={`${styles.addBtn} link ut-btn`}
                    onClick={this._addOption}
                    key={1}
                >+ Add Option</a>);
            break;
        case 'text':
            optList.push(
                <div key={1}>
                    <input
                        data-id={1}
                        data-type="input"
                        type="text"
                        className={`${styles.longText} js-opt ut-input input input--medium`}
                        value={data}
                        onChange={this._onChangeHandle}
                        onFocus={this._handleFocusEvent}
                    />
                    <div className="input__msg js-opt-msg"></div>
                </div>);
            break;
        default:
        }

        if (editQuestion.type === 'radio' || editQuestion.type === 'checkbox') {
            // radio/checkbox have this button
            otherBtn.push(
                <a
                    className={`${styles.otherBtn} link ut-other`}
                    onClick={this._addOption}
                    key={2}
                >Add "Other"</a>);
        }

        return (
            <div className={styles.item}>
                {optList}
                {otherBtn}
            </div>
        );
    }

    _renderData(data) {
        const optList = [];
        data.forEach((opt, idx) => {
            const pros = {
                key: idx,
                data: opt,
                onChangeHandle: this._onChangeHandle,
                onDeleteHandle: this._onDeleteHandle,
                moveItem: this._moveItem
            };
            optList.push(
                <EditItem
                    id={idx}
                    {...pros}
                    className="ut-opt"
                />
            );
        });
        return optList;
    }

    _onChangeHandle(e) {
        const { editQuestion, handleChangeEvent } = this.props;
        const idx = e.target.getAttribute('data-id');
        const type = e.target.getAttribute('data-type');
        let newData;
        if (typeof editQuestion.data === 'string') {
            newData = e.target.value;
        } else {
            newData = [...editQuestion.data];
            const data = {
                [type]: e.target.value
            };
            newData[idx] = Object.assign({}, newData[idx], data);
        }
        handleChangeEvent({ data: newData });
    }

    _onDeleteHandle(idx) {
        const { editQuestion, handleChangeEvent } = this.props;
        const newData = [...editQuestion.data];
        newData.splice(idx, 1);
        handleChangeEvent({ data: newData });
    }

    _addOption(e) {
        const { editQuestion, handleChangeEvent } = this.props;
        let opt;
        if (e.target.getAttribute('data-type') === 'other') {
            opt = {
                value: Mixins.generateQuestionID(),
                label: values.OPTION_TITLE
            };
        } else {
            opt = {
                value: Mixins.generateQuestionID(),
                label: values.OPTION_TITLE,
                input: values.PLACEHOLDER_TITLE
            };
        }

        const newData = [...editQuestion.data, opt];
        handleChangeEvent({ data: newData });
    }

    _moveItem(dragIndex, hoverIndex) {
        const { editQuestion, handleChangeEvent } = this.props;
        if (dragIndex !== hoverIndex) {
            const newData = [...editQuestion.data];
            const moveOpt = newData[dragIndex];
            newData.splice(dragIndex, 1);
            newData.splice(hoverIndex, 0, moveOpt);
            handleChangeEvent({ data: newData });
        }
    }

    _handleFocusEvent(e) {
        const target = e.target;
        const compareStr = target.getAttribute('data-type') === 'label' ?
            values.OPTION_TITLE : values.PLACEHOLDER_TITLE;
        if (target.value === compareStr) {
            target.value = '';
        }
    }
}

export default EditMultiOptions;
