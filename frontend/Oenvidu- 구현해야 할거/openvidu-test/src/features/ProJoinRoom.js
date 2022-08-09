function ProJoinRoom() {
    return (
      <div className="pro-join-room">
        <form className="form-group">
          <p>
              <label>Participant: </label>
              <input
                  className="form-control"
                  type="text"
                  id="userName"
                  required
              />
          </p>
          <p>
              <label> Session: </label>
              <input
                  className="form-control"
                  type="text"
                  id="sessionId"
                  required
              />
          </p>
          <input className="btn btn-lg btn-success" name="commit" type="submit" value="JOIN" />
        </form>
      </div>
    );
  }
  
  export default ProJoinRoom;