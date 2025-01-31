#ifndef DEBUFF_H
#define DEBUFF_H

namespace debuff
{

    enum ID : int
    {
        FIRE_VULNERABILITY = 22959,
        WINTERS_CHILL = 12579,
    };


    class Debuff
    {

    public:
        ID id;
        std::string name;
        double duration;
        int stacks = 1;
        int max_stacks = 1;
        bool hidden = false;

        int addStack()
        {
            if (stacks < max_stacks)
                stacks++;
            else
                return 0;

            return stacks;
        }

    };

    class FireVulnerability : public Debuff
    {

    public:
        FireVulnerability()
        {
            id = FIRE_VULNERABILITY;
            name = "Fire Vulnerability";
            duration = 30;
            max_stacks = 5;
        }

    };

    class WintersChill : public Debuff
    {

    public:
        WintersChill()
        {
            id = WINTERS_CHILL;
            name = "Winter's Chill";
            duration = 15;
            max_stacks = 5;
        }

    };

}

#endif