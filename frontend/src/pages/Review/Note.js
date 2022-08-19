import React, { Component } from 'react';
import './Note.css';
import Draggable from 'react-draggable'

class Note extends Component {

    constructor(props, context) {
        super(props, context)
        this.state = {
            editing: false
        }

        this.edit = this.edit.bind(this)
        this.save = this.save.bind(this)
        this.remove = this.remove.bind(this)
        this.randomBetween = this.randomBetween.bind(this)
        this.renderForm = this.renderForm.bind(this)
        this.renderDisplay = this.renderDisplay.bind(this)
    }

    edit() {
        this.setState({editing: true})
    }

    save(){
        this.props.onChange(this.refs.newText.value, this.props.id)
        this.setState({editing: false})
    }

    remove() {
        this.props.onRemove(this.props.id)
    }

    componentWillMount() {
        this.style = {
            right: this.randomBetween(0, window.innerWidth - 400, 'px'),
            top: this.randomBetween(0, window.innerHeight - 400, 'px')
        }
    }

    componentDidUpdate(){
        if(this.state.editing){
            this.refs.newText.focus() // focus the textarea
            this.refs.newText.select() // `select all` of text
        }
    }

    shouldComponentUpdate(nextProps, nextState){ // prevent unnecessary re-rendering
        return this.props.children !== nextProps.children || this.state !== nextState
    }

    randomBetween(x, y, s){
        return (x + Math.ceil(Math.random() * (y-x))) + s
    }

    renderForm() {
        return ( 
            <div className="note"
                 style={this.style}>
                <textarea ref="newText"
                          defaultValue={this.props.children}></textarea>
                <span>
                  <button onClick={this.save}>저장</button>
                </span>
            </div>
        )
    }

    renderDisplay(){
        return ( 
            <div className="note"
                 style={this.style}>
                <p>{this.props.children}</p>
                <span>
                  <button onClick={this.edit}>수정</button>
                  <button onClick={this.remove}>X</button>
                </span>
            </div>
        )
    }

    render() {
        return ( <Draggable>
                {(this.state.editing) ? this.renderForm()
                    : this.renderDisplay()}
            </Draggable>)
    }

}

export default Note;