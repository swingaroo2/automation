# Automation Playbook v1.0

The purpose of this playbook is to structure my approach to test automation work. The idea is to avoid spinning my wheels trying to do multiple things at once that should be split into different phases, like design and implementation. This is also a training document for building muscle memory of proper planning, analysis, and design work. Like going to the gym to build a weak muscle.

1. Read the feature

- name the page under test
- name the UI elements you will be interacting with
- name the test objectives
  1. what interactions will be tested?
  2. what expected behaviors will be tested?

2. Create test design

- declare test cases up front, high level definitions and assertions
- determine logical groupings for test cases (future `test.describe` blocks)
- derive locators from test cases, identify how to access them (role, attribute, class, etc)
- define POM classes to encapsulate locators, if needed, including helper methods
- define fixtures to surface POM classes in spec files, if needed

Note to future me: if you think up an extra test case while implementing, run it through the design loop before coding.
You can make a note to finish out current tests, then revisit the new TCs later

3. Implement helper code: locators, POM classes, fixtures

4. Build test skeleton

- Implement high level test cases and groupings
- Use `test.step` to scaffold test case implementation and set up traceability

5. For each test...

- `console.log` important data incrementally -- verify correct data instead of assuming, before using that data
- get to a passing assertion as directly as possible, going off the design phase work
- DON'T WRITE AND EDIT AT THE SAME TIME

6. Code review

- briefly research best practices for procedures used in tests. 10 minute limit per procedure (eg BPs for looping, substring substitution, and more)
- past the 10 minute point, either implement a concrete refactor idea or leave it as-is (given the test case in question is presumably already working)
- refactor pass based on research and static testing

7. 3 consecutive clean runs

8. Commit -- deliver the deliverable

Time Management Note: If you end up 30 minutes past the timebox on any work timeboxed for over an hour, bring the blocker to the proctor instead of spinning your wheels in the mud. Anything shorter than an hour has a 2x-timebox cutoff.
