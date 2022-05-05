 <template> 
    <carousel-3d :control-visible="true" :clickable="false" :height="300">
        <slide :index="i" :key="i" v-for="(slide,i) in slides">
                <figure>
                    <img src="slide.src"/>
                        <figcaption>
                            <v-btn text color="white">{{slide.text}}</v-btn>
                        </figcaption>
                </figure>
        </slide>
    </carousel-3d>
</template>
<script>
import {Carousel3d,Slider} from "vue-carousel-3d"
    export default {
        data:() => ({
                slides: [
                    {src:  require('./podium.png'), text: "PODIUM"}
                ]
        }),
        components: {
            Carousel3d,
            Slide
        }
    }

</script>
<style scope>
.carousel-3d-container figure {
    margin: 0;
}
.carousel-3d-container figcaption {
    position:absolute;
    background-color:rgba(0,0,0,0.5);
    color:white;
    bottom:0;
    position: absolute;
    padding:15;
    font-size:12;
    min-width:100%;
    box-sizing:border-box;
}
.next span,.prev span {
    color:orange;
    
}
</style>
