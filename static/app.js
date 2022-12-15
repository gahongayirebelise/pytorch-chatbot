//let us create a class called js.jscript

class Chatbox{
    //create a constructor here
    constructor(){
    
        //defining different arguments
        this.args={
            openButton: document.querySelector('.chatbox__button'),
            chatBox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.send__button')
    
        }
        this.state=false;//our chatbot is closed in the beginning
        this.message = [];//array of our messages
    }
    
    //we create one function to display the messages
    
    display(){
        const {openButton,chatBox,sendButton}=this.args;//we extract our arguments
        openButton.addEventListener('click',()=>this.toggleState(chatBox))//adding eventlistener, when we click the button we want to call the toggle function
        sendButton.addEventListener('click',()=>this.onSendButton(chatBox))//adding eventlistener, when we click the button we want to call to send message by calling the sendButton function
    
        const node = chatBox.querySelector("input");
        node.addEventListener("keyup", ({key})=>{
            if (key=="enter"){//here we listen to the enter button, we want to send the message too
    
                this.onSendButton(chatBox)
            }
        })
    }
    
    //Let us implement the above functions: toggleState(chatBox), onSendButton(chatBox)
    
    toggleState(chatbox){
        this.state= !this.state
    
        //show or hides the box
    
        if (this.state) {
            chatbox.classList.add('chatbox--active')
        } else {
            chatbox.classList.remove("chatbox--active")
        }
    }
    
    onSendButton(chatbox){
        var textField = chatbox.querySelector('input');//here we extract the text from the user input
        let text1 = textField.value
        if (text1==''){//we check if our text is empty
            return;
        }
    //here we want to send this message to our chatbot
        let msg1 = {name:"user", message:text1}//we define a dictionary(object in js)
        this.message.push(msg1)//this message is the same as message we put in app.py
                              //we push this message to the message array
    //Here we are sending a post request to this urls
        //http://127.0.0.1:5000/predict
    
        fetch($SCRIPT_ROOT+'/predict',{//$SCRIPT_ROOT is somewhere in html and you do not have to write again http:127.0.0.1:5000
            method:'POST',
            body:JSON.stringify({message:text1}),
            mode:'cors',//we want to allow cross origin resource//this might not be important if you are you chose to use this file internally inside your flask
            //but if you deploy your flask app separetely, you have to allow this
            headers: {
                'Content-Type':'application/json'
            },
             })
             //we wait for the response
             .then(r=>r.json())//extract json
             //send the message back to the user
             .then(r=>{
                let msg2={name:'Belise',message:r.answer};
                this.message.push(msg2)
                this.updateChatText(chatbox)
                textField.value=""
             });
    
    
    }
    
    updateChatText(chatbox){
        var html = "";
        this.message.slice().reverse().forEach(function(item){
            if (item.name=="Belise"){
                html +='<div class="message__item message__item--visitor">'+item.message + '</div>'
    
            } else {
                html +='<div class="message__item message__item--operator">'+item.message + '</div>'
            };
    
            const chatmessage = chatbox.querySelector('.chatbox__messages');
            chatmessage.innerHTML=html; 
        })
    }
    }
    
    
    
    //instance of our class
    
    const chatbot= new Chatbox();
    chatbot.display();