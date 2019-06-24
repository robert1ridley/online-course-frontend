import React from 'react';

export default class ClassesList extends React.Component {
    componentDidMount() {
        const { accessToken, userid, usertype, onBadToken } = this.props.data;
        const payload = {
            userid: userid,
            usertype: usertype
        }
        fetch('http://127.0.0.1:5000/user/teacher/allclasses', {
        method: 'POST',
        headers: {
          'Content-Type':'application/json',
          'Authorization': 'Bearer ' + accessToken
        },
        body: JSON.stringify(payload)
      }).then((res) => {
        if (res.status !== 200) {
          sessionStorage.clear()
          onBadToken()
        }  
        return res.json()
        }
      )
    .then(data => {console.log(data)})
    .catch(err => {console.log(err)})
    }

    render(){
        return (
            <div>
                ClassesList
            </div>
        )
    }
}