# Move the specific test file to a temporary directory
mkdir ../test_temp
mv ../test/StakingV1.test.ts ../test_temp/

# Run coverage
npx hardhat coverage --testfiles ../test_temp/*

# Move the test file back to the original directory
mv ../test_temp/StakingV1.test.ts ../test/
rmdir ../test_temp
