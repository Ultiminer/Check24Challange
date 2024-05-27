#include <fstream>
#include <string>
#include <iostream>
/*
Gen Args: STD, FILEPATH, search_string, key_val, numRes 
*/

inline void SearchMatch(const char* path, std::string findMe, const std::string& key, const int numResult)
{
    std::ifstream in{path};
    std::string line=""; 
    std::string retVal=""; 
    size_t count=0; 
    while(count<numResult&&std::getline(in,line))
    {
        const size_t pos=line.find_first_of(key);
        const size_t loc=line.find(findMe,(pos!=std::string::npos)?pos:0);
        if(loc!=std::string::npos)
        {
            retVal+=line+"\n";
            count++;
        }
        line="";
    }
    in.close();
    std::cout<<retVal; 
}


int main(int argc, char** argv)
{
    if(argc<5)return 0;
    SearchMatch(argv[1],argv[2],argv[3],std::atoi(argv[4]));
    return 0; 
}