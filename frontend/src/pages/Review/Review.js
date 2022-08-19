import React, { Component } from 'react';
import './Review.css';
import Note from './Note'

class Review extends Component {
  constructor(props, context) {
      super(props, context)

      this.state = {
          notes: []
      }

      this.nextId = this.nextId.bind(this)
      this.add = this.add.bind(this)
      this.update = this.update.bind(this)
      this.remove = this.remove.bind(this)
      this.eachNote = this.eachNote.bind(this)
  }

  componentWillMount(){
      document.title = "Bulletin Board";

      if ( this.props.count ) {
          var url = `//baconipsum.com/api/?type=all-meat&sentences=${this.props.count}`
          fetch(url)
              .then(results => results.json())
              .then(array => array[0])
              .then(text => text.split('. '))
              .then(array => array.forEach(
                      sentence => this.add(sentence)))
              .catch(function(err) {
                  console.log("Didn't connect to the API", err)
              })
      }
  }

  nextId(){
      this.uniqueId = this.uniqueId || 0;
      return this.uniqueId++
  }

  add(text) {
      var notes = [
          ...this.state.notes,
          {
              id: this.nextId(),
              note: text
          }
      ]
      this.setState({notes})
  }

  update(newText, id){
      var notes = this.state.notes.map(
          note => (note.id !== id) ? 
              note : 
              {
                  ...note, 
                  note: newText
              }
      )

      this.setState({notes})
  }

  remove(id){
      var notes = this.state.notes.filter(note => note.id !== id)
      this.setState({notes})
  }

  eachNote(note) {
      return (<Note key={note.id}
                    id={note.id}
                    onChange={this.update}
                    onRemove={this.remove}>
                  {note.note}
              </Note>)
  }

  render() {
      return (<div className='board'>
              {this.state.notes.map(this.eachNote)}
              <button onClick={() => this.add('new note')}>후기를 작성해 보세요!</button>
          </div>)
  }
  
}


Review.propTypes = {
    count: function(props, propName){
        var count = props[propName]
        if(typeof count !== 'number') {
            return new Error('Property `count` must be a number')
        }
        if(count > 100) {
            return new Error('Refused to create Board with `count` of ' + count)
        }
    }
}


export default Review;