import React, { Component } from 'react';
import { View, Text, ScrollView, FlatList, StyleSheet, Modal, Button, PanResponder, Alert, Share } from 'react-native';
import { Card, Icon, Rating, Input } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite } from '../redux/ActionCreaters'
import { postComment } from '../redux/ActionCreaters'
import * as Animatable from 'react-native-animatable';


const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        comments: state.comments,
        favorites: state.favorites
    }
};

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment: (dishId, rating, author, comment) =>dispatch(postComment(dishId, rating, author, comment))
});



function RenderDish(props){
    const dish = props.dish;

    const recognizeDragR2L = ({ moveX, moveY, dx, dy }) => {
        if ( dx < -100 )
            return true;
        else
            return false;
    }

    const recognizeDragL2R = ({ moveX, moveY, dx, dy }) => {
        if ( dx > 100 )
            return true;
        else
            return false;
    }

    const shareDish = (title, message, url) => {
        Share.share({
            title: title,
            message: title + ': ' + message + ' ' + url,
            url: url
        },{
            dialogTitle: 'Share ' + title
        })
    }

    handleViewRef = ref => this.view = ref;
    
    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (e, gestureState) => {
            return true;
        },

        onPanResponderGrant: () => {this.view.rubberBand(1000).then(endState => console.log(endState.finished ? 'finished' : 'cancelled'));},

        onPanResponderEnd: (e, gestureState) => {
            console.log("pan responder end", gestureState);
            if (recognizeDragR2L(gestureState))
                Alert.alert(
                    'Add Favorite',
                    'Are you sure you wish to add ' + dish.name + ' to favorite?',
                    [
                    {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                    {text: 'OK', onPress: () => {props.favorite ? console.log('Already favorite') : props.onPressFav()}},
                    ],
                    { cancelable: false }
                );

            if(recognizeDragL2R(gestureState))
                    props.onPressComment();

            return true;
        }
    })
    
    if(dish!=null){
        return(
            <Animatable.View animation="fadeInDown" duration={2000} delay={0} ref={this.handleViewRef} {...panResponder.panHandlers}>
                <Card
                    featuredTitle={dish.name}
                    image={{ uri: baseUrl + dish.image }} >     
                        
                    <Text style={{margin: 10}}>
                        {dish.description}
                    </Text>
                    <View style={styles.button_layout}>
                        <Icon 
                            raised
                            reverse
                            name={ props.favorites ? 'heart' : 'heart-o'}
                            type='font-awesome'
                            color='#f50'
                            onPress={() => props.favorites ? console.log('Already favourite') : props.onPressFav()} />

                        <Icon 
                            raised
                            reverse
                            name={ 'pencil' }
                            type='font-awesome'
                            color='#512DA8'
                            onPress= {props.onPressComment} />

                        <Icon
                            raised
                            reverse
                            name='share'
                            type='font-awesome'
                            color='#51D2A8'
                            onPress={() => shareDish(dish.name, dish.description, baseUrl + dish.image)} />
                        
                    </View>
                    
                </Card>
            </Animatable.View>
        );

    }
    else{
        return(<View></View>);
    }
}

function RenderComments (props){
    const comments = props.comments;

    const rederCommentItem = ({ item, index}) => {
        return(
            <View key={index} style={{ margin: 10}}>
                <Text style={{fontSize: 14}}>{item.comment}</Text>
                <Rating 
                    imageSize={17}
                    readonly
                    startingValue={item.rating}
                    style={{alignItems: 'flex-start'}}
                />
                <Text style={{fontSize: 12}}>{'-- '+ item.author+', '+item.date}</Text>
            </View>
        );
    }

    return(
        <Animatable.View animation="fadeInUp" duration={2000} delay={0}> 
            <Card title="Comments">
                <FlatList 
                    data={comments} 
                    renderItem={rederCommentItem}
                    keyExtractor={item => item.id.toString()}
                />
            </Card>
        </Animatable.View>
    );
}
class DishDetail extends Component{

    constructor(props) {
        super(props);

        this.state = {
            showModal: false,
            author: "",
            comment: "",
            rating: null
        }
    }

    

    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }

    static navigationOption = {
        title: 'Dish Details'
    }

    toggleModal() {
        this.setState({showModal: !this.state.showModal});
    }

    handleComment() {
        const dishId = this.props.navigation.getParam('dishId','');
        this.toggleModal();
        this.props.postComment(dishId, this.state.rating, this.state.author, this.state.comment)
        
    }

    resetForm(){
        this.state = {
            showModal: false,
            author: "",
            comment: "",
            rating: null
        }
    }


    render(){

        const dishId = this.props.navigation.getParam('dishId','');

        return(
            <ScrollView>
                <RenderDish dish={this.props.dishes.dishes[+dishId]}
                    favorites={this.props.favorites.some(el => el === dishId)}
                    onPressFav={() => this.markFavorite(dishId)}
                    onPressComment={() => this.toggleModal()}
                />
                
                <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />

                <Modal animationType = {"slide"} transparent = {false}
                    visible = {this.state.showModal}
                    onDismiss = {() => this.toggleModal() }
                    onRequestClose = {() => this.toggleModal() }>

                        <View>
                            <Rating 
                                imageSize={40}
                                startingValue={0}
                                showRating
                                onFinishRating={(rating) => this.setState({ rating: rating})}
                                style={{marginTop: 20, marginBottom: 20}}
                            >
                            </Rating>
                            <Input
                                placeholder="Author"
                                onChangeText={(author) => this.setState({author: author})}
                                leftIcon={{ type: "font-awesome", name: "user-o", marginRight: 10}}
                            />
                            <Input
                                placeholder="Comment"
                                onChangeText={(comment) => this.setState({comment: comment})}
                                leftIcon={{ type: "font-awesome", name: "comment-o", marginRight: 10}}
                            />
                            <View style={{margin: 20}}>
                                <Button
                                    color="#512DA8"
                                    title="Submit"
                                    onPress={() => {
                                        this.handleComment();
                                        this.resetForm();   
                                    }}  
                                />
                            </View>
                            <View style={{margin: 20, marginTop: 0}}>
                                <Button
                                    color="gray"
                                    title="Cancel"
                                    onPress={() => {
                                        this.toggleModal();
                                        this.resetForm();   
                                    }}  
                                />
                            </View>
                        </View>


                </Modal>

            </ScrollView>
            
        );
    }
}

const styles = StyleSheet.create({
    button_layout: {
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
      flexDirection: "row"
    }

});

export default connect(mapStateToProps, mapDispatchToProps)(DishDetail);