package Fact.Frenzy2.FactFrenzy2.Configs;

import io.micrometer.common.lang.NonNull;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints( StompEndpointRegistry registry) {

        //connection must say connect
        registry.addEndpoint("/connect")
                .setAllowedOrigins("http://localhost:3000")
                .withSockJS();
    }

    @Override
    public void configureMessageBroker( MessageBrokerRegistry registry) {

        //every send must start with /app/<whatever>
        registry.setApplicationDestinationPrefixes("/app");

        //client must subscribe to /room/<whatever> topic
        registry.enableSimpleBroker("/room");
    }
}