import React, { Component } from 'react';
import { ScrollView, Text, View, Animated, Easing } from 'react-native';
import { Card } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { Loading } from './LoadingComponent';


const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        comments: state.comments,
        promotions: state.promotions,
        leaders: state.leaders
    }
}


function RenderItem(props) {
    const item = props.item;

    if(props.isLoading) {
        return (
            <Loading />
        );
    }
    else if ( props.errMess) {
        return(
            <View>
                <Text>{props.errMess}</Text>
            </View>
        );
    }
    else {
        if(item!=null){
            return(
                
                <Card
                    featuredTitle={item.name}
                    featuredSubtitle={item.designation}
                    image={{ uri: baseUrl + item.image }}
                    >
                        <Text style={{margin: 10}}>
                            {item.description}
                        </Text>
                    
                </Card>
            );
        }
        else{
            return(
                <View></View>
            );
        }
    }

    
}

class Home extends Component {

    constructor(props) {
        super(props);
        this.animatedValue = new Animated.Value(0);        
    }

    static navigationOption = {
        title: 'Home'
    }

    componentDidMount () {
        this.animate()
    }

    animate () {
        this.animatedValue.setValue(0)
        Animated.timing(
          this.animatedValue,
          {
            toValue: 8,
            duration: 15000,
            easing: Easing.linear
          }
        ).start(() => this.animate())
    }

    render() {
        const xpos1 = this.animatedValue.interpolate({
            inputRange: [0, 1, 2, 3, 4, 5, 6, 7, 8],
            outputRange: [800, 600, 400, 200, 0, -200, -400, -600, -800]
        })
        const xpos2 = this.animatedValue.interpolate({
            inputRange: [0, 1, 2, 3, 4, 5, 6, 7, 8],
            outputRange: [800, 600, 400, 200, 0, -200, -400, -600, -800]
        })
        const xpos3 = this.animatedValue.interpolate({
            inputRange: [0, 1, 2, 3, 4, 5, 6, 7, 8],
            outputRange: [800, 600, 400, 200, 0, -200, -400, -600, -800]
        })

        return (
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                <Animated.View style={{ width: '100%', transform: [{translateX: xpos1}]}}>
                    <RenderItem item={this.props.dishes.dishes.filter((dish) => dish.featured)[0]} isLoading={this.props.dishes.isLoading} errMess={this.props.dishes.errMess} />
                </Animated.View>
                <Animated.View style={{ width: '100%',  transform: [{translateX: xpos2}]}}>
                    <RenderItem item={this.props.promotions.promotions.filter((promo) => promo.featured)[0]} isLoading={this.props.promotions.isLoading} errMess={this.props.promotions.errMess} />
                </Animated.View>
                <Animated.View style={{ width: '100%',  transform: [{translateX: xpos3}]}}>
                    <RenderItem item={this.props.leaders.leaders.filter((leader) => leader.featured)[0]} isLoading={this.props.leaders.isLoading} errMess={this.props.leaders.errMess} />
                </Animated.View>
            </View>
        );
    }
}

export default connect(mapStateToProps)(Home);