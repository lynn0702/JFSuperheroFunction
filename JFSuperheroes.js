module.exports = { discordFormattedHero, discordFormattedFullText, makeCharacter, getMainCharacterDiscordString, getPowersetsDiscordString, getMilestonesDiscordString };

let specialties = [
  "Acrobatics",
  "Business",
  "Combat",
  "Covert",
  "Crime",
  "Medical",
  "Menace",
  "Psych",
  "Science",
  "Tech",
  "Vehicle",
  "Mystic",
  "Cosmic",
];

let energies = [
  "Cosmic",
  "Electric",
  "Fire",
  "Gravity",
  "Ice",
  "Kinetic",
  "Light",
  "Magnetic",
  "Water",
];
let weirdEnergies = [
  "Air",
  "Cosmic",
  "Earth",
  "Electric",
  "Fire/ Heat",
  "Gravity",
  "Ice/Cold",
  "Kinetic",
  "Light",
  "Magnetic",
  "Negative",
  "Sonic",
  "Water",
  "Weather",
];

let weapons = ["Claws", "Swords", "Axes", "Unique Weapon"];
let movements = [
  "Airwalk",
  "Burrow",
  "Flight",
  "Leap",
  "Speed",
  "Swim",
  "Swing",
];

let prodigies = [
  "Acrobatics",
  "Business",
  "Combat",
  "Covert",
  "Crime",
  "Medical",
  "Menace",
  "Psych",
  "Science",
  "Tech",
  "Vehicle",
];

let otherwordlyMovements = ["Airwalk", "Flight", "Speed"];
let sfxes = [
  "Absorption",
  "Afflict",
  "Area Attack",
  "Berserker",
  "Boost",
  "Burst",
  "Constructs",
  "Dangerous",
  "Focus",
  "Healing",
  "Immunity",
  "Invulnerable",
  "Master Plan",
  "Multipower",
  "Push",
  "Regenerate",
  "Second Chance",
  "Second Wind",
  "Unleashed",
  "Versatile",
];

let limits = [
  "Conscious Activation",
  "Mutually Exclusive",
  "Exhausted",
  "Gear",
  "Growing Dread",
  "Issues",
  "Powered Down",
  "Uncontrollable",
  "Vulnerable",
];

let distinctionDescriptors = 
[["Absent-Minded","Adolescent","Alienated","Ambitious","Aristocratic","Artistic"],
["Attention- Seeking","Banished","Bitter","Bloodthirsty","Boisterous","Brutal"],
["Calculating","Charming","Compassionate","Competitive","Controlling","Dangerous"],
["Dashing","Deadly","Defiant","Devout","Disciplined","Disillusioned"],
["Duplicitous","Dutiful","Eclectic","Eerily Calm","Enthusiastic","Ethical"],
["Extroverted","Faithful","Fearless","Fiendish","Flamboyant","Fugitive"],
["Fun-Loving","Genius","Gentle","Gifted","Grasping","Gregarious"],
["Headstrong","Heroic","Honorable","Hotheaded","Icy","Impatient"],
["Imperious","Impetuous","Inexperienced","Innocent","Innovative","Insecure"],
["Intense","Intimidating","Introverted","Intuitive","Judgmental","Kind- Hearted"],
["Know-it-All","Law-Abiding","Logical","Lonely","Loyal","Malcontent"],
["Maverick","Mercenary","Mercurial","Misfit","Morally Flexible","Mysterious"],
["Obsessed","Opportunistic","Optimistic","Pacifist","Painstakingly Thorough","Passionate"],
["Penitent","Persuasive","Pessimist","Powerful","Prodigal","Questioning"],
["Quirky","Rabble-Rousing","Radical","Refugee","Relentless","Reluctant"],
["Revolting","Romantic","Rude","Ruthless","Sarcastic","Secretive"],
["Shady","Sheltered","Single-Minded","Spirited","Streetwise","Strong- Willed"],
["Superstitious","Swashbuckling","Thoughtful","Timid","Traditional","Trigger- Happy"],
["Uncompromising","Underappreciated","Unpredictable","Untrusting","Unyielding","Vengeful"],
["Veteran","Vigilant","Whiny","Wise- Cracking","Young","Zealous"]];

let distinctionNouns = [["Activist","Alien","Android","Archer","Artisan","Artist"],
["Assassin","Astronaut","Athlete","Atlantean","Attorney","Bounty Hunter"],
["Competitor","Criminal","Cryptid","Curmudgeon","Deceiver","Defender"],
["Demigod","Detective","Doctor","Engineer","Entertainer","Entrepreneur"],
["Executive","Experiment","Explorer","Extrovert","Fashion Maven","First Responder"],
["Freak","Fugitive","Gambler","Gangster","Genius","Ghost"],
["Hacker","Heir","Homemaker","Hybrid","Immortal","Imposter"],
["Industrialist","Infiltrator","Influencer","Interloper","Introvert","Inventor"],
["Investigator","Journalist","Kid","Knight","Leader","Legend"],
["Lieutenant","Lone Wolf","Loose Cannon","Lycanthrope","Martial Artist","Mastermind"],
["Mercenary","Misanthrope","Monarch","Monster","Mountaineer","Mutant"],
["Mystic","Naturalist","Negotiator","Ninja","Nurse","Outcast"],
["Outsider","Pacifist","Parent","Party Animal","Peacemaker","Philanthropist"],
["Politician","Powerhouse","Priest","Professional","Psychic","Rebel"],
["Refugee","Researcher","Revolutionary","Romantic","Samurai","Savior"],
["Scholar","Scientist","Secret Agent","Sentinel","Slacker","Socialite"],
["Soldier","Sorcerer","Spirit","Spy","Strategist","Student"],
["Superfan","Supporter","Survivalist","Teacher","Test Pilot","Test Subject"],
["Thief","Traveler","Undead","Veteran","Vigilante","Villain"],
["Visionary","Warrior","Werewolf","Wheelchair User","Wisecracker","Wizard"]];

let milestones = [["A Darker Path","A New Beginning","Active Military","Avenger","Back From The Dead","Bad Influence","Believer","Bookworm"],
["Choosing Your Moment","Combat Veteran","Coming Of Age","Curious Nature","Deep Cover Agent","Difficult Relationships","Doing What's Necessary","Experimenter"],
["Far Traveler","Freelancer","Fresh Meat","Fugitive","Glory Hound","Great Power","Heartbreaker","Homesick"],
["I’m Not Worthy","Independent","Jaded Hero","Judge & Jury","Legacy Of Violence","Liberator","Martial Arts Master","Master Of Disguise"],
["Moving Forward","The Name Of The Game","Nagging Conscience","Natural Leader","No Hero","Nobody","Outsider Among Humans","Overcoming Hate"],
["Peacemaker","Penitent","Protector","Purposeful Leadership","Radical","Rebel","Reckless Confidence","Regaining Trust"],
["The Scary One","Seeking Closure","Silver Spoon","Straight-edge","Stranger In A Strange Land","Student Becomes The Teacher","Team Player","Tentative Connections"],
["This Is My Town","Thug Life","Top Dog","Tree Hugger","Trust No One","Visions Of A Dark Future","War Without End","Wisecracks"]];

const sfxFullText = {
    "Absorption": "If you succeed on a reaction against <type of stress or complication>, convert your opponent’s effect die into an asset for yourself or step up a power by one for your next roll. Spend a PP to create this asset if your opponent succeeds.",
    "Adaptive Tactics": "If your dice pool only includes one power trait, you can step down and double any one die in your pool.",
    "Afflict": "Add a d6 and step up your effect die by one when inflicting <type of stress or complication> on a target.",
    "Area Attack": "Spend a PP to act against multiple targets. For each additional target past the first, add a d6 and keep an extra effect die.",
    "Berserker": "Add a die from the doom pool to your  action. When you’re done, step the doom die up and return it to the doom pool.",
    "Boost": "Shut down your highest rated <power set> power to step up another <power set> power by one. Activate an opportunity to restore the power.",
    "Burst": "Step up or double a power die against a single target. Remove the highest rolling die from your pool and add 3 dice together for your total.",
    "Constructs": "Add a d6 and step up your effect die by one when using <power set> to create assets.",
    "Dangerous": "Add a d6 to your dice pool for an attack and step down the highest die in pool by one. Step up the effect die by one.",
    "Focus": "If a pool includes a <power set> power, you may replace two dice of equal size with one die one step larger.",
    "Healing": "Step up or double <power> in your dice pool when helping others recover <type of stress>. Spend a PP to recover your own or another’s <type of stress> by one.",
    "Immunity": "Spend a PP to ignore ignore <type of stress or complication> from <specific attack type>.",
    "Invulnerable": "Spend a PP to ignore <type of stress or complication> unless caused by <specific attack type>.",
    "Master Plan": "Spend a PP to borrow the highest die in the doom pool as an asset for your next action. After the roll is resolved,  step back and return that doom die.",
    "Multipower": "Use two or more <power set> powers in a single dice pool and step each power down by one for each additional power beyond the first.",
    "Push": "Step up or double any <power set> power for one roll. After the roll is resolved, take d6 <type of stress>",
    "Regenerate": "Add d8 to the doom pool to remove all your <type of stress> and step back your trauma of the same type.",
    "Second Chance": "Spend a to reroll when using any <power set> power.",
    "Second Wind": "Before you put together a dice pool including a <power set> power, move your <type of stress> to the doom pool. Step up the <power set> power by one for this roll.",
    "Unleashed": "Step up or double any <power set> power for one roll. If the roll fails, add your effect die to the doom pool.",
    "Versatile": "Split a power trait die into two dice, stepped down by one; or three dice, stepped down by two."
  };


const limitsFullText = {
"Conscious Activation": "If taken out, asleep, or unconscious, shut down <power set>. Restore <power set> when you awake.",
"Exhausted": "Shut down any <power set specific> power to gain a PP. Activate an opportunity to restore the power.",
"Gear": "Shut down <power set> and gain a PP. Recover by taking an action against the doom pool.",
"Growing Dread": "Both 1 and 2 on your dice count as hitches when using a <power set> power.",
"Issues": "Take a d6 complication related to <specific circumstances> and gain 1 PP.",
"Mutually Exclusive": "Shut down <power set a> to activate <power set b>. Shut down <power set b> to restore <power set a>.",
"Powered Down": "While you are <in a specific situation>, step down all <power set> power sets and gain a PP. Recover by leaving the scene or rolling an action that changes the situation.",
"Uncontrollable": "Change any <power set> power into a complication and gain a PP. Activate an opportunity or remove the complication to restore the power.",
"Vulnerable": "While you are <in a specific situation>, take d6 <type of stress> and gain a PP."
};

const milestonesFullText = {
    "A Darker Path": 
    "1 XP when you strike off on your own, without the help of your allies, to face an enemy who has earned your vengeance.\n3 XP when another hero expresses dissatisfaction with your methods, or when you threaten another hero with violence.\n10 XP when you finally kill someone you’d been hunting, or when you give up your chance at revenge to accomplish a larger goal.", 
    "A New Beginning": 
    "1 XP when you inform someone that you used to be a member of a prestigious team or that you have joined a new one tied to a famous legacy.\n3 XP when you use your old team connections to get assistance, or when you refuse to assist a former comrade because you're busy.\n10 XP when you lose or relinquish your status as a team member, or when you quit your current team because it's not as good as another one.", 
    "Active Military": 
    "1 XP when you give orders to soldiers.\n3 XP when you alter or ignore orders given to you by someone who outrank you.\n10 XP when you either achieve the highest rank possible, or sever your military ties and declare yourself an independent agent.", 
    "Avenger": 
    "1 XP when you declare your need for revenge against a worthy foe who deserves it.\n3 XP when you inflict trauma on the chosen target of your vengeance.\n10 XP when you forgive the chosen target of your vengeance, or they beg your for your forgiveness and you chose to let things go.", 
    "Back From The Dead": 
    "1 XP when you show compassion towards someone who has faced death.\n3 XP when you reveal a darker side of yourself that comes from having died and been resurrected.\n10 XP when you decide to set aside your darker side and commit to walking in the light, or when you decide your naivete is what got you killed and choose to embrace your dark side from now on.", 
    "Bad Influence": 
    "1 XP when you try to convince an ally to either help you cover up an unlawful act or commit such an act themselves.\n3 XP when you take someone out for a night on the town or try to convince someone to accept their own past misdeeds, true nature, or current infamy.\n10 XP when you decide to change your ways for good, or when you commit a crime too grave for your allies to forgive.", 
    "Believer": 
    "1 XP when you perform a religious rite or prayer.\n3 XP when you inflict a complication upon a blasphemer or something abhorrent to your religion.\n10 XP when you complete a grand work in the name of your faith, or when your devotion leads to your martyrdom.", 
    "Bookworm": 
    "1 XP when you share an insight based on your knowledge of academics or niche trivia.\n3 XP when you geek out over encountering a thing or person you’ve read all about.\n10 XP when your obscure knowledge saves the life of a teammate, or when you quit the team because they don’t respect your knowledge.", 
    "Choosing Your Moment": 
    "1 XP when you declare yourself neutral in a conflict or join the fight against a more powerful foe.\n3 XP when you deny pleas for assistance or take leadership via martial prowess or political cunning.\n10 XP when you seize or decline a position of power, or when you walk away from a cause for good.", 
    "Combat Veteran": 
    "1 XP when you take charge in the heat of battle.\n3 XP when you teach combat skills to a teammate.\n10 XP when you take over leadership of your team or leave your current team to join a more combative one.", 
    "Coming Of Age": 
    "1 XP when you talk to a more experienced teammate about your problems or how you’ve overcome difficult challenges already.\n3 XP when a more experienced teammate gives you support during a non-combat scene, or when you turn down a more experienced teammate's offer of help.\n10 XP when you take an instrumental role in your team’s defeat of an enemy with at least one d12 trait, or when you take trauma while trying to defeat such an enemy without help.", 
    "Curious Nature": 
    "1 XP when you ask an ally from another culture a question about their history or customs\n3 XP when you get into a conflict with a member of your own culture on behalf of some from another\n10 XP when you either end a conflict between two cultures or choose sides in such a conflict in a way you can’t take back", 
    "Deep Cover Agent": 
    "1 XP when you pass confidential information from a faction to its rivals, or when you talk to enemy agents as if they were your allies.\n3 XP when someone attempts to blow your cover, or when you give orders in the heat of battle to members of the faction you’ve infiltrated..\n10 XP when you change or reveal your true allegiance, or when you ruin or reveal a hidden conspiracy’s plan.", 
    "Difficult Relationships": 
    "1 XP when a long-time friend, family member, or loved one rejects you in some way, or when you try to get them to let you back into their life.\n3 XP when you use deception to be close to someone you care about.\n10 XP when you take trauma while trying to protect the person you care about, or when you purposefully inflict trauma on a person you care about to advance a hidden agenda.", 
    "Doing What'S Necessary": 
    "1 XP when you take trauma or a physical complication trying to save a stranger’s life, or when you express guilt for something terrible you did while working with less ethical allies.\n3 XP when you reprimand a teammate for not doing what needed to be done, or when you inflict trauma on a former ally while cursing them for making you do it.\n10 XP when you save a community from a major threat, or are forced to kill someone for the greater good.", 
    "Experimenter": 
    "1 XP when you reveal a new technology-based asset you created or discovered with your specialized skillset.\n3 XP when you arm yourself or your allies with questionable assets during a non-combat scene.\n10 XP when you use a questionable technological asset to support a team member or when a perceived insult keeps you from supporting a team member.", 
    "Far Traveler": 
    "1 XP when you display or express ignorance of local customs.\n3 XP when you insist on following your own customs in a way that endangers your teammates.\n10 XP when you leave the team to return home, or when you permanently sever connections with your old home, declaring that the team is now the only family you have.", 
    "Freelancer": 
    "1 XP when you start a scene working for another PC as an employee, or when you obey instructions from your employer that you don’t agree with\n3 XP when you engage with a foe after it takes out your employer or when you remove your employer from a dangerous situation\n10 XP when either quite working for your employer to join a team as an equal or decline an offer from a worthy team to continue working for your employer", 
    "Fresh Meat": 
    "1 XP when you ask if you’ve been accepted into the team, or defend your right to join it.\n3 XP when you fight alongside a teammate, or inflict a non-physical complication on a teammate who doubts you.\n10 XP when you prove yourself by taking trauma for the team, or when you choose to walk away.", 
    "Fugitive": 
    "1 XP when you point out that you are an outlaw or that you're no hero, or when you offer enemies a chance to flee.\n3 XP when you stop running and choose a place to settle in for the night, or when you do something that undermines your attempts to lay low.\n10 XP when you permanently leave a place where you’ve settled in order to avoid a threat, or when you dig in your heels and defend your new home from a threat that could destroy you.", 
    "Glory Hound": 
    "1 XP when you take down an opponent you previously created an asset against\n3 XP when you attempt a reckless but glorious deed, or when you abstain from such a deed out of caution.\n10 XP when you assume leadership responsibilities, or take down an enemy alone who had at last one trait at d12.", 
    "Great Power": 
    "1 XP when you discuss past victories.\n3 XP you discuss past defeats\n10 XP when you threat to the land or use your powers to create an asset so that a teammate can defeat that threat.", 
    "Heartbreaker": 
    "1 XP when you flirt with someone you shouldn't flirt with or reference a past romantic conquest.\n3 XP when you find a moment alone to be intimate with someone you shouldn't be intimate with.\n10 XP when you actually get serious about a relationship or break the heart of someone you truly care for to maintain your independence.", 
    "Homesick": 
    "1 XP when you remark to a teammate that something that reminds you of home.\n3 XP when you do something incredible that you could never do at home.\n10 XP when you take a teammate home to see it for themselves, or when you reject or harm a beloved person from home for the sake of the team.", 
    "I’M Not Worthy": 
    "1 XP when you first question—or another character questions—your place on the team.\n3 XP when you are faced with a situation where the rest of the team is depending on you, and you either succeed or let them down.\n10 XP when you are faced with the decision: step up and decide that you are worthy to be on this team, or decide that you are not worthy and decide to step down.", 
    "Independent": 
    "1 XP when you disobey the word or spirit of an order.\n3 XP when you purposefully choose to do something that will add a die to the doom pool.\n10 XP when you take out an ally to get the job done or to prevent an enemy's escape.", 
    "Jaded Hero": 
    "1 XP when you express boredom, arrogance, or impatience while doing something most people would consider extraordinary.\n3 XP when you once again find yourself the only one qualified to handle a crisis, or when your overconfidence becomes your undoing.\n10 XP when a teammate admits you've been more effective than the rest of the team, or when you admit you've made terrible mistakes.", 
    "Judge & Jury": 
    "1 XP when you announce that a crime has been committed, or assist someone in seeking justice.\n3 XP when you declare you are taking charge of an investigation or successfully track down a wrong-doer.\n10 XP when you leave behind a larger duty to focus on your current obligations, or vice-versa.", 
    "Legacy Of Violence": 
    "1 XP when you propose or discuss a less violent approach.\n3 XP when you take out an enemy who is threatening your friends.\n10 XP when you either commit to living peacefully or decide to embrace your violent legacy for good.", 
    "Liberator": 
    "1 XP when you first inflict a complication on any agent of authority, tyrant, or oppressor.\n3 XP when you liberate someone (including yourself) from imprisonment or bondage, or when you take trauma to defy injustice.\n10 XP when you choose to abandon your current team to fight for freedom more directly, or when you turn down a chance to do so in order because you think you can do more good as part of your current team.", 
    "Martial Arts Master": 
    "1 XP when you identify, compliment, or critique a specialized combat technique.\n3 XP when you inflict a complication on another martial artist.\n10 XP when you either defeat a rival martial artist and offer to take them as a student or admit that your opponent is your better and declare them a true master.", 
    "Master Of Disguise": 
    "1 XP when you ask questions, seeking out information that will help you impersonate someone.\n3 XP when you take someone’s place during a time when they would have made a significant leadership or romantic decision.\n10 XP when you either create great conflict while masquerading as a powerful leader or use disguise to prevent such an incident.", 
    "Moving Forward": 
    "1 XP when you reminisce about previous adventures.\n3 XP when you point out something new and startling.\n10 XP when you retire from adventuring for a safer job, or you take an opportunity for adventure in order to learn something new or experience something different.", 
    "The Name Of The Game": 
    "1 XP when you talk about your target and how you plan to bring them in.\n3 XP when you create an asset that helps the team capture your quarry.\n10 XP when you either bring in an enemy alive who has a d12 trait, or let someone go because it is the right thing to do.", 
    "Nagging Conscience": 
    "1 XP when you refuse to turn away from someone that needs help (even when someone else could easily remove them from danger).\n3 XP when you menace someone into taking action, or when you hurt one innocent person to save another in greater need.\n10 XP when you defeat a threat clearly more powerful than yourself with a d12 in at least one trait, or when you save that threat from imminent death despite your better judgment.", 
    "Natural Leader": 
    "1 XP when you give an order to a teammate.\n3 XP when a teammate uses a tactical/support asset you created for them.\n10 XP when your teammates officially recognize you as their leader, or when a rival teammate claims the leadership role that should be yours.", 
    "No Hero": 
    "1 XP when you explain to an ally how they are being weak or foolish and why it will get people killed, or when you declare how ridiculous a teammate's behavior is.\n3 XP when you question a team’s tactics or stick to your mission even when compromised by innocent bystanders or obstacles.\n10 XP when you convince a teammate to accept your methods or you decide to alter your methods out of respect for a teammate and tell them so.", 
    "Nobody": 
    "1 XP when you hide or take action to stay out of the spotlight.\n3 XP when you leave the shadows to accomplish something important.\n10 XP when you step into the spotlight in front of a large group in order to accomplish something important, or when something happens that causes you to try quitting the team to survive alone.", 
    "Outsider Among Humans": 
    "1 XP when you display or express ignorance of human customs.\n3 XP when you participate in a mundane but complex human activity without revealing yourself, or when you are revealed as a non-human while trying to blend in among everyday humans.\n10 XP when you are finally accepted by humans as one of their heroes, or when you abandon your quest for acceptance and leave to find a new home.", 
    "Overcoming Hate": 
    "1 XP when you encounter prejudice against you and either confront it successfully or manage to ignore it with dignity.\n3 XP when you take action to protect someone with a prejudiced viewpoint or turn away and choose to let such a person face the consequences of their actions.\n10 XP when you dismantle a conspiracy based on bigotry, or make a great sacrifice to save a community even though some within it hate you.", 
    "Peacemaker": 
    "1 XP when you talk to a teammate in an effort to head off conflict before it occurs.\n3 XP when you set aside one-on-one time a teammate to either ease their worries or help them recover.\n10 XP when you either explode at your teammates, inflicting complications because you’re unable to handle the pressure of keeping the peace, or when you take trauma as a result of maintaining the peace among your teammates.", 
    "Penitent": 
    "1 XP when you point out someone else's wrongdoing or express regret for your own.\n3 XP when you refuse to grant leniency, or when you choose not to punish a wrong-doer.\n10 XP when you announce that you feel you have finally paid for your crimes, or accept that you never will.", 
    "Protector": 
    "1 XP when you prevent an ally from taking a complication.\n3 XP when you take a complication due to protecting someone or disobeying your personal code.\n10 XP when you take trauma while protecting someone or allow an ally you could have saved to take trauma.", 
    "Purposeful Leadership": 
    "1 XP when you first assume leadership of a team including at least one member you previously called a friend.\n3 XP when you defeat a foe without any team member being taken out.\n10 XP when you sacrifice members of your team to accomplish the mission, or choose your teammates’ lives over the mission.", 
    "Radical": 
    "1 XP when you discuss non-violent means of opposing oppression or plan a violent act of defiance.\n3 XP when you create an asset that helps someone overcome their oppressor.\n10 XP when you either pledge your life to non-violence as a tactic for change or publicly disavow non-violent means and seek a more direct means of change.", 
    "Rebel": 
    "1 XP when you express mockery, bewilderment, or contempt toward the dominant culture in which you find yourself.\n3 XP when you express your rebellion against a government or culture in a public or spectacular way.\n10 XP when you either find a place in a new culture, or when you launch a new revolution.", 
    "Reckless Confidence": 
    "1 XP when you overestimate your abilities.\n3 XP when you leap into a situation that is way over your head.\n10 XP when you either are severely humbled in a crisis from leaping into action reckless, or come out of a tough situation unscathed, only making your hot-headedness worse.", 
    "Regaining Trust": 
    "1 XP when a love one or long-time friend rejects you in some way, or when you try to assure them you are still worthy of trust.\n3 XP when an attempted reconciliation is disrupted by violence or a need for action, or when you take someone out of a contentious situation so you can speak privately.\n10 XP when you get a family member or long-time friend to trust you again or forgive your past transgressions, or when you tell them you understand why they can’t and agree to go your separate ways.", 
    "The Scary One": 
    "1 XP when your attack action demonstrates the sinister nature of your abilities.\n3 XP when you add at least a d8 to the doom pool, either from rolling two or more hitches on a single roll or by using an SFX that adds to the doom pool.\n10 XP when you are finally claimed by a villainous influence for dark deeds, or you strike a major blow against a villainous influence by using their own evil or dark powers against them.", 
    "Seeking Closure": 
    "1 XP when you express trust or affection for someone who has previously wronged you, or when you express distrust for a long-time friend, family member, or loved one.\n3 XP when you take a complication from a long-time friend, family member, or loved one, or when you create an asset that benefits such a hero.\n10 XP when you defeat an enemy with at least one d12 power while fighting side-by-side with a character who has previously wronged you, or when you leave a team that includes such a character to try and live a normal life.", 
    "Silver Spoon": 
    "1 XP when you say something dismissive about poor people or a less well-off teammate.\n3 XP when you try to buy your way out of a problem.\n10 XP when you surrender your family’s wealth in order to accomplish a noble cause, or when you leave the team to live a comfortable life of luxury.", 
    "Straight-Edge": 
    "1 XP when you abstain from a worldly pleasure.\n3 XP when you get in trouble by indulging yourself for once.\n10 XP when you convince an indulgent comrade to permanently abstain from worldly pleasures, or abandon your temperance to live it up in one long party.", 
    "Stranger In A Strange Land": 
    "1 XP when you first express confusion, contempt, or unbridled enthusiasm for the ways of the new culture in which you find yourself.\n3 XP when you make your heritage the central issue of a conflict.\n10 XP when you either embrace a new culture wholeheartedly, or you abandon your allies to return to your home culture.", 
    "Student Becomes The Teacher": 
    "1 XP when you point out how a current problem is a similar to a problem you faced early in your career, or when you discuss a lesson you previously weren't ready to learn.\n3 XP when you help a younger or less experienced ally or when you create an asset that benefits such an ally in battle.\n10 XP when someone you've mentored contributes significantly to defeating an enemy with at least one d12 trait, or when you convince a younger or less experienced teammate to give up their place on the team and try to live a normal life.", 
    "Team Player": 
    "1 XP when you first proclaim your team’s name or catchphrase in a scene or explain that someone is an old foe of your team.\n3 XP when you become involved in a fight with someone you’ve explained is an old foe of your team.\n10 XP when you confront *a foe no single hero could withstand*, and in the aftermath either rally the team to stay together or encourage them to disband.", 
    "Tentative Connections": 
    "1 XP when you declare your trust or affection for another character.\n3 XP when you take a complication from someone you trust or create a complication that benefits your allies.\n10 XP when you risk great pain or death to save someone you care about, or when perceived betrayal drives you away from someone you care about.", 
    "This Is My Town": 
    "1 XP when you help out everyday locals with trouble they aren't equipped to handle or discuss a plan to do so.\n3 XP when you create an asset for the use of a local or one or more of your allies.\n10 XP when an operation that started out as just helping an average citizen ends with saving the entire community, or when you leave your community to pursue other goals or adventures.", 
    "Thug Life": 
    "1 XP when you acquire money or spend it frivolously.\n3 XP when you commit a crime during an action scene when you could instead be contributing to the fight\n10 XP when you find the big score that sets you up for life, or when you give it all up in one dramatic act of altruism.", 
    "Top Dog": 
    "1 XP when you state that a course of action proves that someone you already look down upon is a loser.\n3 XP when you put yourself in a position to take a complication for someone you previously mistreated, or when someone you mistreated inflicts a complication on you.\n10 XP when you perform an act of inexcusable violence towards someone because you look down on them, or when you make a great sacrifice to save a teammate you seemed to look down on.", 
    "Tree Hugger": 
    "1 XP when you pick a natural tool over something artificial.\n3 XP when you create a natural asset for someone else.\n10 XP when you lay down your life to protect the sanctity of nature, or if you allow nature to be harmed in a major way to save a life (perhaps even your own).", 
    "Trust No One": 
    "1 XP when you accuse someone of an act against you for which there is no evidence.\n3 XP when you inflict a d8 or higher complication on yourself, or when you secretly create an asset for an ally.\n10 XP when you leave your team to seek help from someone you can trust, or when you take trauma due to the actions of an ally you trusted.", 
    "Visions Of A Dark Future": 
    "1 XP when you share disturbing truths from the future you've seen, or when your methods upset or discomfort your present allies.\n3 XP when you tell an ally what you saw them do in the future and what it meant to you, or when you describe future horrors to a present enemy.\n10 XP when you decisively prevent the dark future you saw from happening, or when you accept that it is destined to happen no matter what you do.", 
    "War Without End": 
    "1 XP when you declare war on someone or that someone’s actions have made them your enemy.\n3 XP when you take a complication from conflict with a declared enemy.\n10 XP when you declare war against an entire culture, organization, or society, or when you broker a peace you can live with.", 
    "Wisecracks": 
    "1 XP when you crack a joke while inflicting a complication on a foe, or remark on how the current situation is too serious to joke about when inflicting a complication.\n3 XP when another hero accuses you of not taking things seriously or when you mock another hero for being too serious.\n10 XP when you either leave your overly-serious teammates behind or accept a position of responsibility related to your current team."
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

function addSpecialties(character, numToAdd, rating) {
  for (let i = 0; i < numToAdd; i++) {
    const prodigyPowers = character.powersets
  .flatMap(powerset => powerset.powers
    .filter(power => power.name.endsWith(" Prodigy"))
    .map(power => power.name.substring(0, power.name.length - " Prodigy".length))
  );
    let specialty = addUniqueSpecialty(character.specialties.concat(prodigyPowers));
    character.specialties.push({ name: specialty, rating: rating });
  }
}

function addUniqueSpecialty(existingSpecialties) {
  let roll = getRandomIntInclusive(1, 12);
  if (roll >= 1 && roll <= 11) {
    if (
      existingSpecialties.findIndex((i) => i.name === specialties[roll - 1]) ==
      -1
    )
      return specialties[roll - 1];
    else return addUniqueSpecialty(existingSpecialties);
  }
  if (roll == 12) {
    if (
      existingSpecialties.findIndex((i) => i.name === "Mystic") > -1 &&
      existingSpecialties.findIndex((i) => i.name === "Cosmic") > -1
    )
      return addUniqueSpecialty(existingSpecialties);
    roll = getRandomIntInclusive(1, 2);
    if (
      roll == 1 &&
      existingSpecialties.findIndex((i) => i.name === "Mystic") == -1
    )
      return "Mystic";
    else if (existingSpecialties.findIndex((i) => i.name === "Cosmic") == -1)
      return "Cosmic";
    else return addUniqueSpecialty(existingSpecialties);
  }
}

function rollSetsAndSpecialties(character) {
  let roll = getRandomIntInclusive(1, 12);
  if (roll >= 1 && roll <= 2) {
    rollSpecialtyRatings(character);
    rollSpecialtyRatings(character);
    rollSpecialtyRatings(character);
    character.powersets.push(createPowerSet(character, 1, 2));
  }
  if (roll >= 3 && roll <= 5) {
    rollSpecialtyRatings(character);
    rollSpecialtyRatings(character);
    character.powersets.push(createPowerSet(character, 2, 2));
    
  }
  if (roll >= 6 && roll <= 8) {
    rollSpecialtyRatings(character);
    rollSpecialtyRatings(character);
    character.powersets.push(createPowerSet(character, 1, 1));
    character.powersets.push(createPowerSet(character, 1, 1));
  }
  if (roll >= 9 && roll <= 11) {
    rollSpecialtyRatings(character);
    rollSpecialtyRatings(character);
    character.powersets.push(createPowerSet(character, 2, 1));
    character.powersets.push(createPowerSet(character, 1, 1));
  }
  if (roll == 12) {
    character.powersets.push(createPowerSet(character, 2, 1));
    character.powersets.push(createPowerSet(character, 2, 1));
  }
}

function rollPowerRatings(character, powerset) {
  let roll = getRandomIntInclusive(1, 12) + getPowersCount(character, powerset);
  if (roll == 1) {
    powerset.powers.push(
      getUniquePower(character,
        character.powersets.flatMap((p) => p.powers),
        10, powerset
      )
    );
    powerset.powers.push(
      getUniquePower(character,
        character.powersets.flatMap((p) => p.powers).concat(powerset.powers),
        8, powerset
      )
    );
    powerset.powers.push(
      getUniquePower(character,
        character.powersets.flatMap((p) => p.powers).concat(powerset.powers),
        6, powerset
      )
    );
    powerset.powers.push(
      getUniquePower(character,
        character.powersets.flatMap((p) => p.powers).concat(powerset.powers),
        6, powerset
      )
    );
  }
  if (roll == 2) {
    powerset.powers.push(
      getUniquePower(character,
        character.powersets.flatMap((p) => p.powers),
        12, powerset
      )
    );
  }
  if (roll == 3) {
    powerset.powers.push(
      getUniquePower(character,
        character.powersets.flatMap((p) => p.powers),
        8, powerset
      )
    );
    powerset.powers.push(
      getUniquePower(character,
        character.powersets.flatMap((p) => p.powers).concat(powerset.powers),
        8, powerset
      )
    );
    powerset.powers.push(
      getUniquePower(character,
        character.powersets.flatMap((p) => p.powers).concat(powerset.powers),
        6, powerset
      )
    );
    powerset.powers.push(
      getUniquePower(character,
        character.powersets.flatMap((p) => p.powers).concat(powerset.powers),
        6, powerset
      )
    );
    powerset.sfx.push(getUniqueSFX(character.powersets, powerset));
  }
  if (roll == 4) {
    powerset.powers.push(
      getUniquePower(character,
        character.powersets.flatMap((p) => p.powers),
        8, powerset
      )
    );
    powerset.powers.push(
      getUniquePower(character,
        character.powersets.flatMap((p) => p.powers).concat(powerset.powers),
        8, powerset
      )
    );
    powerset.powers.push(
      getUniquePower(character,
        character.powersets.flatMap((p) => p.powers).concat(powerset.powers),
        8, powerset
      )
    );
    powerset.powers.push(
      getUniquePower(character,
        character.powersets.flatMap((p) => p.powers).concat(powerset.powers),
        8, powerset
      )
    );
  }
  if (roll == 5) {
    powerset.powers.push(
      getUniquePower(character,
        character.powersets.flatMap((p) => p.powers),
        10, powerset
      )
    );
    powerset.powers.push(
      getUniquePower(character,
        character.powersets.flatMap((p) => p.powers).concat(powerset.powers),
        6, powerset
      )
    );
    powerset.powers.push(
      getUniquePower(character,
        character.powersets.flatMap((p) => p.powers).concat(powerset.powers),
        6, powerset
      )
    );
    powerset.sfx.push(getUniqueSFX(character.powersets, powerset));
  }
  if (roll == 6) {
    powerset.powers.push(
      getUniquePower(character,
        character.powersets.flatMap((p) => p.powers),
        10, powerset
      )
    );
    powerset.powers.push(
      getUniquePower(character,
        character.powersets.flatMap((p) => p.powers).concat(powerset.powers),
        8, powerset
      )
    );
    powerset.powers.push(
      getUniquePower(character,
        character.powersets.flatMap((p) => p.powers).concat(powerset.powers),
        6, powerset
      )
    );
    powerset.sfx.push(getUniqueSFX(character.powersets, powerset));
  }
  if (roll >= 7 && roll <= 8) {
    powerset.powers.push(
      getUniquePower(character,
        character.powersets.flatMap((p) => p.powers),
        8, powerset
      )
    );
    powerset.powers.push(
      getUniquePower(character,
        character.powersets.flatMap((p) => p.powers).concat(powerset.powers),
        8, powerset
      )
    );
    powerset.powers.push(
      getUniquePower(character,
        character.powersets.flatMap((p) => p.powers).concat(powerset.powers),
        8, powerset
      )
    );
    powerset.sfx.push(getUniqueSFX(character.powersets, powerset));
  }
  if (roll >= 9 && roll <= 10) {
    powerset.powers.push(
      getUniquePower(character,
        character.powersets.flatMap((p) => p.powers),
        10, powerset
      )
    );
    powerset.powers.push(
      getUniquePower(character,
        character.powersets.flatMap((p) => p.powers).concat(powerset.powers),
        8, powerset
      )
    );
    powerset.powers.push(
      getUniquePower(character,
        character.powersets.flatMap((p) => p.powers).concat(powerset.powers),
        8, powerset
      )
    );
  }
  if (roll == 11) {
    powerset.powers.push(
      getUniquePower(character,
        character.powersets.flatMap((p) => p.powers),
        10, powerset
      )
    );
    powerset.powers.push(
      getUniquePower(character,
        character.powersets.flatMap((p) => p.powers).concat(powerset.powers),
        8, powerset
      )
    );
    powerset.sfx.push(getUniqueSFX(character.powersets, powerset));
  }
  if (roll == 12) {
    powerset.powers.push(
      getUniquePower(character,
        character.powersets.flatMap((p) => p.powers),
        10, powerset
      )
    );
    powerset.powers.push(
      getUniquePower(character,
        character.powersets.flatMap((p) => p.powers).concat(powerset.powers),
        10, powerset
      )
    );
  }
  if (roll == 13) {
    powerset.powers.push(
      getUniquePower(character,
        character.powersets.flatMap((p) => p.powers),
        8, powerset
      )
    );
    powerset.powers.push(
      getUniquePower(character,
        character.powersets.flatMap((p) => p.powers).concat(powerset.powers),
        8, powerset
      )
    );
    powerset.sfx.push(getUniqueSFX(character.powersets, powerset));
  }
  if (roll >= 14) {
    powerset.powers.push(getUniquePower(character, character.powersets.flatMap((p) => p.powers), 10, powerset));
    powerset.sfx.push(getUniqueSFX(character.powersets, powerset));
    powerset.sfx.push(getUniqueSFX(character.powersets, powerset));
  }
    return powerset;
}

function rollSpecialtyRatings(character) {
  let roll = getRandomIntInclusive(1, 6) + character.specialties.length;
  if (roll >= 1 && roll <= 4) {
    addSpecialties(character, 4, 8);
  }
  if (roll >= 5 && roll <= 6) {
    addSpecialties(character, 1, 10);
    addSpecialties(character, 2, 8);
  }
  if (roll >= 7) {
    addSpecialties(character, 2, 10);
  }
}

function createPowerSet(character, rolls, sfx) {
  let powerSet = { powers: [], sfx: [] };
  assignLimits(character, powerSet);
  for (let i = 0; i < sfx; i++) {
    powerSet.sfx.push(getUniqueSFX(character.powersets, powerSet));
  }
  for (let i = 0; i < rolls; i++) {
    powerSet = rollPowerRatings(character, powerSet);
  }
  return powerSet;
}

function getPowersCount(character, powerset) {
  let count = 0;
  for (let i = 0; i < character.powersets.length; i++) {
    count += character.powersets[i].powers?.length;
  }
  count += powerset.powers?.length;
  return count;
}

function getUniquePower(character, powers, rating, powerset) {
  let roll = getRandomIntInclusive(1, 10);
  let existingPowers = [];
  if (powers) {
    for (let i = 0; i < powers.length; i++) {
      existingPowers.push(powers[i].name);
    }
  }

  if (roll >= 1 && roll <= 3) {
    return getUniqueIconicPower(existingPowers, rating);
  }
  if (roll >= 4 && roll <= 5) {
    return getUniqueMentalPower(existingPowers, rating);
  }
  if (roll >= 6 && roll <= 7) {
    return getUniqueOtherwordlyPower(existingPowers, rating);
  }
  if (roll >= 8 && roll <= 9) {
    return getUniqueStreetLevelPower(character, existingPowers, rating, powerset);
  }
  if (roll == 10) {
    return getUniqueWeirdPower(existingPowers, rating);
  }
}

function getUniqueIconicPower(existingPowers, rating) {
  let roll = getRandomIntInclusive(1, 10);
  let power = "";
  let innerRating = rating;
  if (roll == 1) {
    let type = getRandomIntInclusive(1, 2);
    if (type == 1) {
      let energy = energies[getRandomIntInclusive(0, energies.length - 1)];
      power = energy + " Blast";
    }
    if (type == 2) {
      power = weapons[getRandomIntInclusive(0, weapons.length - 1)];
    }
  }
  if (roll == 2) {
    power = "Durability";
  }
  if (roll == 3) {
    power = movements[getRandomIntInclusive(0, movements.length - 1)];
  }
  if (roll == 4) {
    power = "Intelligence";
    if (innerRating > 6) {
      innerRating -= 2;
    }
  }
  if (roll == 5) {
    power = "Reflexes";
  }
  if (roll == 6) {
    let resistanceType =
      energies[getRandomIntInclusive(0, energies.length - 1)];
    power = resistanceType + " Resistance";
    if (innerRating < 12) {
      innerRating += 2;
    }
  }
  if (roll == 7) {
    power = "Senses";
  }
  if (roll == 8) {
    power = "Stamina";
  }

  if (roll == 9) {
    power = "Strength";
  }
  if (roll == 10) {
    return getUniqueWeirdPower(existingPowers, rating);
  }
  if(power == ""){
    console.log("Power is empty");
  }
  if (existingPowers.findIndex((i) => i === power) == -1)
    return { name: power, rating: innerRating };
  else return getUniqueIconicPower(existingPowers, rating);
}

function getUniqueWeirdPower(existingPowers, rating) {
  let roll = getRandomIntInclusive(1, 10);
  let power = "";
  let innerRating = rating;
  if (roll == 1) {
    power = "Animal Control";
  }
  if (roll == 2) {
    let energy =
      weirdEnergies[getRandomIntInclusive(0, weirdEnergies.length - 1)];
    power = "Control " + energy;
    if (innerRating > 6) {
      innerRating -= 2;
    }
  }
  if (roll == 3) {
    power = "Intangibility";
  }
  if (roll == 4) {
    power = "Invisibility";
  }
  if (roll == 5) {
    power = "Mimic";
    if (innerRating > 6) {
      innerRating -= 2;
    }
  }
  if (roll == 6) {
    power = "Plant Control";
  }
  if (roll == 7) {
    power = "Shapeshifting";
    if (innerRating > 6) {
      innerRating -= 2;
    }
  }
  if (roll == 8) {
    power = "Size-changing";
  }
  if (roll == 9) {
    power = "Stretch";
  }

  if (roll == 10) {
    power = "Teleport";
  }
  if(power == ""){
    console.log("Power is empty");
  }
  if (existingPowers.findIndex((i) => i === power) == -1)
    return { name: power, rating: innerRating };
  else return getUniqueWeirdPower(existingPowers, rating);
}

function getUniqueMentalPower(existingPowers, rating) {
  let roll = getRandomIntInclusive(1, 10);
  let power = "";
  let innerRating = rating;
  if (roll >= 1 && roll <= 2) {
    power = "Telepathy";
  }
  if (roll == 3) {
    power = "Animal Control";
  }
  if (roll == 4) {
    let energy =
      weirdEnergies[getRandomIntInclusive(0, weirdEnergies.length - 1)];
    power = "Control " + energy;
    if (innerRating > 6) {
      innerRating -= 2;
    }
  }
  if (roll == 5) {
    power = "Intelligence";
    if (innerRating > 6) {
      innerRating -= 2;
    }
  }
  if (roll == 6) {
    power = "Invisibility";
  }
  if (roll == 7) {
    power = "Mind Control";
  }
  if (roll == 8) {
    power = "Psychic Blast";
  }
  if (roll == 9) {
    power = "Psychic Resistance";
    //TODO: Consider an exhaustive search for control powers to prefer selection of higher rated elemental resistance powers here.
  }
  if (roll == 10) {
    power = "Senses";
  }
  if(power == ""){
    console.log("Power is empty");
  }
  if (existingPowers.findIndex((i) => i === power) == -1)
    return { name: power, rating: innerRating };
  else return getUniqueWeirdPower(existingPowers, rating);
}

function getUniqueOtherwordlyPower(existingPowers, rating) {
  let roll = getRandomIntInclusive(1, 10);
  let power = "";
  let innerRating = rating;
  if (roll >= 1 && roll <= 2) {
    power = "Telepathy";
  }
  if (roll == 2) {
    let energy =
      weirdEnergies[getRandomIntInclusive(0, weirdEnergies.length - 1)];
    power = "Control " + energy;
    if (innerRating > 6) {
      innerRating -= 2;
    }
  }
  if (roll == 3) {
    power = "Intangibility";
  }
  if (roll == 4) {
    power =
      otherwordlyMovements[
        getRandomIntInclusive(0, otherwordlyMovements.length - 1)
      ];
  }
  if (roll == 5) {
    power = "Senses";
  }
  if (roll >= 6 && roll <= 7) {
    power = "Sorcery";
    if (innerRating > 6) {
      innerRating -= 2;
    }
  }
  if (roll == 8) {
    power = "Teleport";
  }
  if (roll == 9) {
    power = "Transmutation";
    if (innerRating > 6) {
      innerRating -= 2;
    }
  }
  if (roll == 10) {
    return getUniqueWeirdPower(existingPowers, rating);
  }
  if(power == ""){
    console.log("Power is empty");
  }
  if (existingPowers.findIndex((i) => i === power) == -1)
    return { name: power, rating: innerRating };
  else return getUniqueOtherwordlyPower(existingPowers, rating);
}

function getUniqueStreetLevelPower(character, existingPowers, rating, powerset) {
  //todo: Option to disallow Prodigy
  let roll = character.prodigyEnabled ? getRandomIntInclusive(1, 10) : getRandomIntInclusive(1, 8);
  let power = "";
  let innerRating = rating;
  if (roll >= 1 && roll <= 2) {
    if(getRandomIntInclusive(1,12) % 2 == 0 ) addGearLimit(powerset);
    power = "Durability";
    if (powerset.limits.findIndex((i) => i === "Gear") == -1 && innerRating > 6) {
      innerRating = 6;
    }
  }
  if (roll == 3) {
    power = "Intelligence";
    if (innerRating > 6) {
      innerRating -= 2;
    }
  }
  if (roll == 4) {
    if(getRandomIntInclusive(1,12) % 2 == 0 ) addGearLimit(powerset);
    let resistanceType =
      energies[getRandomIntInclusive(0, energies.length - 1)];
    power = resistanceType + " Resistance";
    if (innerRating < 12) {
      innerRating += 2;
    }
    if (powerset.limits.findIndex((i) => i === "Gear") == -1 && innerRating > 8) {
      innerRating = 8;
    }
  }
  if (roll == 5) {
    if(getRandomIntInclusive(1,12) % 2 == 0 ) addGearLimit(powerset);
    power = "Senses";
    if (powerset.limits.findIndex((i) => i === "Gear") == -1 && innerRating > 8) {
      innerRating = 8;
    }
  }
  if (roll == 6) {
    power = "Swing";
  }
  if (roll >= 7 && roll <= 8) {
    power = weapons[getRandomIntInclusive(0, weapons.length - 1)];
    if (innerRating <= 8) {
      innerRating += 2;
    }
    if (innerRating > 10) {
      innerRating = 10;
    }
  }
  if (roll >= 9 && roll <= 10) {
    let eligibleProdigies = prodigies.filter(x => !character.specialties.map((i) => i.name).includes(x));
if(eligibleProdigies.length == 0) return getUniqueStreetLevelPower(character, existingPowers, rating, powerset);
    power =
    eligibleProdigies[getRandomIntInclusive(0, eligibleProdigies.length - 1)] + " Prodigy";
    if (innerRating <= 8) {
      innerRating += 2;
    }
    if (innerRating > 10) {
      innerRating = 10;
    }
  }
  if(power == ""){
    console.log("Power is empty");
  }
  if (existingPowers.findIndex((i) => i === power) == -1)
    return { name: power, rating: innerRating };
  else return getUniqueStreetLevelPower(character, existingPowers, rating, powerset);
}

function getUniqueSFX(existingPowersets, powerset) {
  let existingSFX = existingPowersets.flatMap((i) => i.sfx);
  if(powerset.sfx.length > 0) existingSFX = existingSFX.concat(powerset.sfx);
  let sfx = sfxes[getRandomIntInclusive(0, sfxes.length - 1)];
  if (existingSFX.findIndex((i) => i === sfx) == -1) return sfx;
  else return getUniqueSFX(existingPowersets, powerset);
}

function getUniqueLimit(character, powerset) {
  let existingLimits = powerset?.limits?.length > 0 ? powerset.limits : [];
  let limit = limits[getRandomIntInclusive(0, limits.length - 1)];
  if(character.powersets?.length <= 1 && limit === "Mutually Exclusive") limit = "Conscious Activation";
  if (existingLimits.findIndex((i) => i === limit) == -1) return limit;
  else return getUniqueLimit(powerset);
}

function assignLimits(character, powerset){
    let roll = getRandomIntInclusive(1, 12);
    powerset.limits = [];
    powerset.limits.push(getUniqueLimit(character, powerset));
    if(roll % 2 == 0){
        powerset.limits.push(getUniqueLimit(character, powerset));
    }
}

function addGearLimit(powerset){
    if(powerset.limits.findIndex((i) => i === "Gear") == -1){
        powerset.limits.push("Gear");
    }
}

function assignAffiliations(character){
    let possibilities = [[10,8,6],[10,6,8],[8,10,6],[8,6,10],[6,10,8],[6,8,10]];
    let result = possibilities[getRandomIntInclusive(0, possibilities.length - 1)];
    character.affiliations = [{name: "Solo", rating: result[0]}, {name: "Buddy", rating: result[1]}, {name: "Team", rating: result[2]}];
}

function assignDistinctions(character){
    let descriptors = [];
while(descriptors.length < 6){
    let descriptor =  distinctionDescriptors[getRandomIntInclusive(0,19)][getRandomIntInclusive(0,5)]; 
    if(descriptors.findIndex((i) => i === descriptor) == -1){
        descriptors.push(descriptor);
    }
}
let nouns = [];
while(nouns.length < 3){
    let noun =  distinctionNouns[getRandomIntInclusive(0,19)][getRandomIntInclusive(0,5)]; 
    if(nouns.findIndex((i) => i === noun) == -1){
        nouns.push(noun);
    }
}
character.distinctions.push(descriptors[0] + (getRandomIntInclusive(1,12) % 2 == 0 ? " " + descriptors[1] : "" ) + " " + nouns[0]);
character.distinctions.push(descriptors[2] +( getRandomIntInclusive(1,12) % 2 == 0 ? " " + descriptors[3] : "" )+ " " + nouns[1]);
character.distinctions.push(descriptors[4] + (getRandomIntInclusive(1,12) % 2 == 0 ? " " + descriptors[5] : "" )+ " " + nouns[2]);
}

function assignMilestones(character){
while(character.milestones.length < 2){
    let milestone =  milestones[getRandomIntInclusive(0,7)][getRandomIntInclusive(0,7)]; 
    if(milestones.findIndex((i) => i === milestone) == -1){
        character.milestones.push(milestone);
    }
}
}

function readableCharacter(prodigyEnabled){
        let character = makeCharacter(prodigyEnabled);
    let result = "";
    //distinctions
    result += "Distinctions: " + character.distinctions.join(", ") + "\n";
    //affiliations
    result += "Affiliations: " + character.affiliations.map((i) => i.name + " D" + i.rating).join(", ") + "\n";
    //specialties
    result += "Specialties: " + character.specialties.map((i) => i.name + " D" + i.rating).join(", ") + "\n";
    //powersets
    result += "Powersets: " + "\n";
    for(let powerset of character.powersets){
        result  += "\tPowerset: " + "\n";
        result += "\t\tPowers: " + powerset.powers.map((i) => i.name + " D" + i.rating).join(", ") + "\n";
        result += "\t\tSFX: " + powerset.sfx.join(", ") + "\n";
        result += "\t\tLimits: " + powerset.limits.join(", ") + "\n";
    }
    //milestones
    result += "Milestones: " + character.milestones.join(", ") + "\n";
    return result;
}

 function discordFormattedHero(prodigyEnabled){
    let character = makeCharacter(prodigyEnabled);
    let result = "";
    //distinctions
    result += "**" + character.distinctions.join(" **|** ") + "**\n\n";
    //affiliations
    result += "**" + character.affiliations.map((i) => i.name + " " + getDiscordDiceIcon( i.rating)).join(" ") + "**\n\n";
    //specialties
    result += "**" + wrapandStringifyRatedTraits(character.specialties, 3, 0) + "**\n\n";
    //powersets
    for(let powerset of character.powersets){
        result  += "Powerset: " + "\n";
        result += "\t**" + wrapandStringifyRatedTraits(powerset.powers, 3, 1) + "**\n";
        result += "SFX: " + powerset.sfx.map((i) => "***" + i + "***" ).join(" | ") + "\n";
        result += "Limits: " + powerset.limits.map((i) => "***" + i + "***" ).join(" | ") + "\n\n";
    }
    //milestones
    result += "Milestones: " + character.milestones.sort().join(" | ") + "\n";
    return result;
}

 function discordFormattedFullText(prodigyEnabled){
  let character = makeCharacter(prodigyEnabled);
  let result = "";
  //distinctions
  result += "**" + character.distinctions.join(" **|** ") + "**\n\n";
  //affiliations
  result += "**" + character.affiliations.map((i) => i.name + " " + getDiscordDiceIcon( i.rating)).join(" ") + "**\n\n";
  //specialties
  result += "**" + wrapandStringifyRatedTraits(character.specialties, 3, 0) + "**\n\n";
  //powersets
  for(let powerset of character.powersets){
      result  += "Powerset: " + "\n";
      result += "\t**" + wrapandStringifyRatedTraits(powerset.powers, 3, 1) + "**\n";
      result += "SFX:\n" + powerset.sfx.map((i) => 
      "***" + i + "***. " + sfxFullText[i] + "\n"
      ).join("") + "\n";
      result += "Limits:\n" + powerset.limits.sort().map((i) =>
       "***"+ i + "***. " +  limitsFullText[i] + "\n")
       .join("") + "\n\n";
  }
  //milestones
  //result += "Milestones: " + character.milestones.sort().map((i) => "***"+ i + "***\n" +  milestonesFullText[i] + "\n").join("") + "\n";
  return result;
}

 function getMainCharacterDiscordString(character){
  let result = "";
  //distinctions
  result += "**" + character.distinctions.join(" **|** ") + "**\n\n";
  //affiliations
  result += "**" + character.affiliations.map((i) => i.name + " " + getDiscordDiceIcon( i.rating)+ " ").join("") + "**\n\n";
  //specialties
  result += "**" + wrapandStringifyRatedTraits(character.specialties, 3, 0) + "**\n\n";
  return result;
}

 function getPowersetsDiscordString(character){
  let result = "";
  for(let powerset of character.powersets){
      result  += "Powerset: " + "\n";
      result += "\t**" + wrapandStringifyRatedTraits(powerset.powers, 3, 1) + "**\n";
      result += "SFX:\n" + powerset.sfx.map((i) => 
      "***" + i + "***. " + sfxFullText[i] + "\n"
      ).join("") + "\n";
      result += "Limits:\n" + powerset.limits.sort().map((i) =>
       "***"+ i + "***. " +  limitsFullText[i] + "\n")
       .join("") + "\n";
  }
  return result;
}

 function getMilestonesDiscordString(character){
  let result = "";
  result += "Milestones: \n" + character.milestones.sort().map((i) => "***"+ i + "***\n" +  milestonesFullText[i] + "\n").join("") + "\n";
  return result;
}

 function wrapandStringifyRatedTraits(traits, wrap, additionalNewLineTabs) {
  let counter = 0;
  return traits.sort().map((i) => {
    counter++;
    let result = i.name + " " + getDiscordDiceIcon( i.rating);
    if (counter % wrap === 0 && counter !== traits.length) {
      result += "\n" + "\t".repeat(additionalNewLineTabs) ;
    }
    return result;
  }).join(" ");
}

 function makeCharacter(prodigyEnabled) {
    let character = {
      specialties: [],
      powersets: [],
      distinctions: [],
      affiliations: [],
      milestones: []
    };
    if(prodigyEnabled) {character.prodigyEnabled = true;}
    addSpecialties(character, 2, 8);
    rollSetsAndSpecialties(character);
    if(character.powersets.length == 1) {character.powersets[0].sfx.push("Adaptive Tactics");}
    assignAffiliations(character);
    assignDistinctions(character);
    assignMilestones(character);
    return character;
  }


function getDiscordDiceIcon(rating){
switch(rating){
  case 4: return "<:d4:1070572120104517704>";
  case 6: return "<:d6:1070572317903683674>";
  case 8: return "<:d8:1070572240892067840>";
  case 10: return "<:d10:1070571984381034526>";
  case 12: return "<:d12:1070572084541009991>";
}
}




//for(let i = 0; i < 1000; i++){
   // let character = makeCharacter(true);
   // console.log(JSON.stringify(character));
  // if(discordFormattedFullText(character).length > 2000)
   // console.log(discordFormattedFullText(character).length);
//}

