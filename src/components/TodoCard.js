import React, { Component } from 'react'

export default class TodoCard extends Component {

    renderInput(input) {
        let isComplete = this.props.completedTodos && this.props.completedTodos.includes(input);
        let hashes = this.props.getHashtags(input) ? this.props.getHashtags(input) : [];

        // get all the hashes & replace them with ''
        hashes.forEach((hash) => {
            input = input.replace(hash, '');
        })
        return (
            <p className={`todoItem ${(this.props.completed || (isComplete)) ? 'completed' : ''}`}>
                {input}
                {hashes.length > 0 && hashes.map((hash, idx) => (<span key={idx} className='chips' onClick={this.props.filterList}>{hash}</span>))}
            </p>
        )
    }
  render() {
    const { value } = this.props;
    return (
        <div onClick={this.props.handleOnClickTodo}>
            {this.renderInput(value)}
        </div>
    )
  }
}
