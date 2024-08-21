# The "Update State" Idiom

Hi everyone! This post is intended as a short tutorial of a GD modding coding pattern I have been using extensively since coming up with it in the process of creating [the new Geode UI for v3](https://x.com/GeodeSDK/status/1804590178931245129). I might make more "best practices" posts in the future too, but we'll see how that goes.

## State management is hard

State management is the quintessential UI problem. Basically every single modern web development library is all about trying to solve state management in a way that's easy to work with while being performant and flexible.

State management in C++ is around two decades behind everything on the web. JS libraries nowadays are all about reactivity and hooks, whereas the best we have in C++ is still to just manually update the UI while you work on it.

For this tutorial, let's consider the following example (which is what actually prompted me to write this): a simple boolean setting toggle!

```cpp
// In the Setting class
m_label = CCLabelBMFont::create("Enable Feature", "bigFont.fnt");
m_reset = CCMenuItemSpriteExtra::create(..., this, menu_selector(Setting::onReset));
m_toggle = CCMenuItemToggler::createWithStandardSprites(this, menu_selector(Setting::onToggle));

// The Setting is contained in a larger popup with more settings, which we shall call Popup
m_apply = CCMenuItemSpriteExtra::create(..., this, menu_selector(Popup::onApply));
```

We are going to be working with four things: a label that displays the name of the setting, a reset button to reset it to its default value, and a toggle for setting its value. Additionally our setting will be contained in a larger popup that simply has an Apply button to "commit" the value of the setting.

There are two states we need to take care of:

 * When the value of the toggle does not match the committed value, the label turns green to mark it being uncommitted
 * When the value of the toggle does not match the default value, the reset button appears; otherwise it is invisible

This state has to be kept in sync whenever any of the actions happen - the toggle is clicked, the reset button is clicked, the apply button is clicked, etc.. The way Cocos2d would recommend you to do this and the way we *could* do this is manually - however that will lead to a lot of code duplication and maintainability issues.

```cpp
void Setting::onReset(CCObject*) {
    m_toggle->toggle(DEFAULT_VALUE);
    m_label->setColor(ccWHITE);
    m_reset->setVisible(false);
}
void Setting::onToggle(CCObject*) {
    m_reset->setVisible(m_toggle->isToggled() != DEFAULT_VAlUE);
    m_label->setColor(m_toggle->isToggled() != COMMITTED_VALUE ? ccc3(0, 255, 0) : ccWHITE);
}
void Popup::onApply(CCObject*) {
    COMMITTED_VALUE = setting->m_toggle->isToggled();
    setting->m_label->setColor(ccWHITE);
    setting->m_reset->setVisible(COMMITTED_VALUE != DEFAULT_VALUE);
}
```

If in the future we added a "Reset All" button to the main Popup too or we made the label blue when the value is non-default, we would need to update every place that changes those values. It would be optimally performant, sure, but it's a nightmare to maintain.

## The single `updateState` function

Rather than manually managing the state every time, we can instead just have a single `updateState` function that updates the entire state of the node at once and then just call that:

```cpp
void Setting::updateState() {
    m_reset->setVisible(m_toggle->isToggled() != DEFAULT_VAlUE);
    m_label->setColor(m_toggle->isToggled() != COMMITTED_VALUE ? ccc3(0, 255, 0) : ccWHITE);
}

void Setting::onReset(CCObject*) {
    m_toggle->toggle(DEFAULT_VALUE);
    this->updateState();
}
void Setting::onToggle(CCObject*) {
    this->updateState();
}
void Popup::onApply(CCObject*) {
    COMMITTED_VALUE = setting->m_toggle->isToggled();
    this->updateState();
}
```

This makes our code much easier to reason about and work with. If we decide to add new deeply interconnected state, we need to edit just one function, and if we decide to add new buttons to change the state, we just need to remember to call one function.

There is of course the drawback that this might incur a small performance loss if the state update is particularly expensive - however, 99% of the time that will not be the case at all. C++ is compiled and very fast, after all - unnecessarily setting the color of label again takes substantially less than the blink of an eye.

## State update propagation via events

What if the Popup wanted to know when a node's state changed, for example to disable the Apply button if there are no uncommitted changes? Cocos2d has traditionally used delegates for this purpose - however, delegates have a ton of drawbacks, like making it only possible to have at most one listener. Using Geode events, we can just do this:

```cpp
struct SettingStateUpdatedEvent : public Event {
    Setting* setting;
};

void Setting::updateState() {
    m_reset->setVisible(m_toggle->isToggled() != DEFAULT_VAlUE);
    m_label->setColor(m_toggle->isToggled() != COMMITTED_VALUE ? ccc3(0, 255, 0) : ccWHITE);
    SettingStateUpdatedEvent(this).post();
}

ListenerResult Popup::onStateUpdated(SettingStateUpdatedEvent* event) {
    m_apply->setEnabled(event->setting->m_toggle->isToggled() != COMMITED_VALUE);
    return ListenerResult::Propagate;
}
bool Popup::init(...) {
    ...

    // m_settingListener is a member of type EventListener<EventFilter<SettingStateUpdatedEvent>>
    m_settingListener.bind(this, &Popup::onStateUpdated);

    ...
}
```

Thank you that is all I had to say
