# COLOR-US
Project for Advanced Coding Tools and Methodologies and Computer Music: Representations and Models. 

## Introduction
As a project for the Advanced Coding Tools and Methodologies course we developed an application oriented to improve live music performances. In a music performance the artist is trying to express their feeling and emotions through the music. However, the emotions provoked by the music can be represented by colors as well (love as red, hope as green, sadness as grey tones…). Our purpose was this, we wanted to improve the live experience of the listeners giving to the artist the tool to represent their music as pallets of colors. This relation between colors is going to be made by matching the seven modal scales with a palette of colors according to the emotions that these scales are related to.
## Modal scales
For this project we have been based on modal scales, but, what are the modal scales?
With the diatonic music there are seven different possible scales (the white keys of the keyboard starting from a note called tonic note). 
![Modal Scales](https://raw.githubusercontent.com/MRMidc/COLOR-US/master/images/modal.JPG)


The difference between the different scales depends on the order of tones and semitones and the relation of the sound with the tonic note. Therefore, if we have the ionian scale in C: 

C - D - E - F - G - A - B

We can rewrite this scale as: 0 - 2 - 4 - 5 - 7 - 9 - 11, being each number the difference in semitones of each note of the scale and the tonic note. However, if we apply this configuration starting with other note we are going to have the ionian scale again but just with a different tonic note. The only way to exactly differentiate each scale is define in a first step the tonic note and then check the configuration of tones and semitones of the scale. However when we are playing a piano we are playing in different octaves and that is a problem to recognize a scale because the difference between a C2 and a D2 is not the same as the one between the same C2 and D1, being D1 and D2 the same note but in different octave. Therefore, we need to have all the notes of the scale in the same octave. 

Emotions are subjective, however there are defined emotions for each scale. Firstly each scale is minor (associated to sadness) or major (associated to happiness). Once that is defined the different major or minor scales, each scale has details that allow us to differentiate between different emotions. The relation we have made for each scale and emotion is:

- **Lydian**: bright, ethereal, dreamy and futuristic.
- **Ionian**: happy, sentimental when is played slow.
- **Mixolydian**: Bluesy, rock and can be even exotic.
- **Dorian**: Sophistication, jazzy.
- **Aeolian**: sentimental, tragic.
- **Phrygian**: Melancholic, sinister, threatening. 
- **Locrian**: darkness and instability.

We have chosen three palettes of colors for each scale depending on the velocity of playing because according to the velocity of playing the scale can change a little bit the emotion that is expressing (e.g. the ionian can be sentimental when is played slowly).

![Palette of colors](https://raw.githubusercontent.com/MRMidc/COLOR-US/master/images/emotion.JPG)



## User interface
As it is said in the introduction this project is focused on a live performance instead of a web site. However, we designed a little user interface emulating the ‘scenario’ used for the project. 

![Palette of colors](https://raw.githubusercontent.com/MRMidc/COLOR-US/master/images/interface.JPG)

In this interface we have an input in which the user have to introduce the tonic note of the scale that he is going to play. This is the only part of the project in which the user has to interact with the interface, the rest has to be made by playing in a MIDI keyboard. 

![Palette of colors](https://raw.githubusercontent.com/MRMidc/COLOR-US/master/images/input.JPG)

Then we have two kind of windows that as it has been said before are emulating the real scenario that is going to be used as performance stage.
## Languages used
This project is based on HTML, CSS and JS code. With HTML we manage the structure of the interface, defining the inputs, its labels, the canvas etc. With CSS we have defined the style information of each part of the UI defined in HTML, like the position of each canvas and the inputs or the background color. Finally JS has the most important role in this project, we can divide it in three main parts:

- **MIDI recognition**: controlling the MIDI messages.
- **Scale definition**: in this part all the process to identify a scale played is made:

  - Translate the tonic note from the input.
  - Collect the seven notes of the playing scale, placing them in the same octave as the tonic note if they are not.
  - Identify the scale that is being played according to the notes that are being played and their velocities.
  - Call the animation functions to represent visually the emotion of the scale.

- **Animation**: which control the different animations presented in this project. We define two different animations:

  - Circles: this animation generates 50 circles, in a random position that are moving with a velocity according to the playing velocity inside a canvas (the two kind of windows at the left and right). The colors of the circles depend on the velocity as well. Each time the artist is playing the circles are changing, for instance if the artist play a chord there will be more circles or if the artist play just one note there will be less circles. In order to avoid the excessive accumulation of circles we define that they will only accumulate when a chord is played, every other situation like pressing a bass note (or a chord) and a melody over it will not accumulate the circles giving that a good sense of the piece played. 
  - Gradient: this animation is generating a gradient color moving in a palette of colors introduced by us. It is based in a external library called Granim. The colors of the gradient correspond to a general palette of colors corresponding to each emotion. 
													The palette of colors used in the animation part are in a database. We used Cloud Firestore to generate this database. There are 21 different arrays with 15 colors each.
## Projection mapping

The project is meant to create an immersive visual live experience and for this our setup was built using projection mapping. For our projection mapping we used the following:

### Software
- **MadMapper**: A video mapping software in which you arrange the visuals and its bound for the projection mapping. By working with masks, it is possible to accommodate several visuals and give them a proper depth into 2-D or 3-D figures. In the Demo video there were around 28 animations that derive from 4 principal animations (Window of circles, the pallet color window, the water effect and the oscilloscope signal).

![Palette of colors](https://raw.githubusercontent.com/MRMidc/COLOR-US/master/images/proy.JPG)

- **Screen Capture Sypho**n: Shares a whole/part of your screen, or a whole/part of a window as Syphon, and can send the video played area to another application as video. 
Syphon is an open source Mac OS X technology that allows applications to share frames - full frame rate video or stills - with one another in real time.

- **Syphon Recorder**: Works as a bridge between Screen Capture Syphon and MadMapper.

![Palette of colors](https://raw.githubusercontent.com/MRMidc/COLOR-US/master/images/syphon.JPG)

### Hardware
- **Projector**: We used a Epson 2150HD projector.

### Stage Design
- **3-D Figures**: 10 cubes (17x17 cm) were used in the setup and divided as 2 towers (5 cubes each). 2 animations were used per cube, a water effect and a part of the window of circles with a degradation of pixels.
- **Keyboard Table**: The table had 3 animations, the first one was in the keyboard itself that worked as light with a given speed, the second one was the water effect (the same used in the cubes) and the third was a part of the window of circles with a degradation of pixels. 

## MIDI
This project is oriented to a live piano performance, therefore it can work with any external MIDI keyboard just connecting it to your PC with an USB cable. What we do in the project is translate the MIDI messages in order to work with them in the JavaScript code and do the specific action. We are going to use three values of the MIDI message:

- **NOTE ON/OFF**: this message is a byte that indicates if a note is on (pressed) or off (released). The translation is 144 NoteOn and 128 NoteOff.
- **Key value**: indicates the note that has an action on it. The values goes from 0, being 0 the C1 note and increases 1 for each semitone. 
- **Pressure**: indicates the pressure (velocity) that you are applying while playing a note. 

## How to use it?
You can try this project in the web or with a projector if you have it. To start you just have to plug your MIDI keyboard in (plug it before open the project) and introduce a valid tonic note (Do, Re, Mi, Fa, Sol, La, Si) in the input. After that you can start playing the music piece that you want. If the piece is in a modal scale, after playing the seven notes corresponding to it the animation will start and will change while you still play.
If you play a note that is not in the scale the system will be restarted in order to know if that was a mistake and you are still in the same scale or if you are changing to a new scale. In this period the animation will remain in the same state until you play the notes of the previous scale or the new one. 
If you decide to stop playing the animation will become inactive (grey tones) until you play a note again.

If you have a projector you need to have the different softwares explained in the ‘Projector mapping’ section and configure it as explained there. 

## What is next?
We don’t want this to be a simple project for a Master course, we would like to continue it adding more functionalities and extras like:
- New animations in order to give the artist the option to choose between different animations according to what they like.
- An easy connection between the JS code and the projector mapping in order to be able to control it even from the UI.
- Read MIDI files. Maybe we just want to play music in an event without having an artist playing it, therefore an upgrade will add the functionality of reading MIDI files and do the exact thing as if an artist is playing it.
- Communication with smart lighting technology that exists nowadays in the market as Hue Lights by Phillips or Lyfx in order to create a better environment for any performance at home.

